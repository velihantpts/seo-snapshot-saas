import { NextResponse } from 'next/server';
import { validateTargetURL } from '@/lib/ssrf-protection';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface Hop { url: string; status: number; statusText: string; location: string | null; }

export async function POST(req: Request) {
  const clientIP = getClientIP(req);
  let body: { url?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (!body.url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const rate = await checkRateLimit(`httphdr:ip:${clientIP}`, 40, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many checks. Try again in a bit.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter || 3600) } });
  }

  const chain: Hop[] = [];
  let currentUrl = body.url;
  let finalRes: Response | null = null;

  try {
    for (let i = 0; i < 10; i++) {
      // Re-validate EVERY hop — a redirect can point at an internal address (SSRF).
      const v = validateTargetURL(currentUrl);
      if (!v.valid || !v.url) {
        return NextResponse.json({ error: i === 0 ? (v.error || 'Invalid URL') : 'A redirect pointed to a blocked or invalid address.' }, { status: 400 });
      }
      const res = await fetch(v.url.toString(), {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'SEOSnapshot-HeaderChecker/1.0 (+https://seosnapshot.dev)' },
      });
      const location = res.headers.get('location');
      chain.push({ url: v.url.toString(), status: res.status, statusText: res.statusText, location });

      if (res.status >= 300 && res.status < 400 && location) {
        currentUrl = new URL(location, v.url).toString();
        continue;
      }
      finalRes = res;
      break;
    }
  } catch (err) {
    const msg = (err as Error)?.message?.toLowerCase() || '';
    let userMessage = 'Could not reach that URL.';
    if (msg.includes('abort') || msg.includes('timeout')) userMessage = 'The site took too long to respond (timeout).';
    else if (msg.includes('enotfound') || msg.includes('dns')) userMessage = 'Could not resolve the domain — check for typos.';
    else if (msg.includes('cert') || msg.includes('ssl') || msg.includes('tls')) userMessage = 'The site has an SSL/TLS certificate error.';
    return NextResponse.json({ error: userMessage }, { status: 502 });
  }

  if (!finalRes) {
    return NextResponse.json({ error: 'Too many redirects (10+). The URL likely has a redirect loop.', chain }, { status: 502 });
  }

  const headers: { name: string; value: string }[] = [];
  finalRes.headers.forEach((value, name) => { headers.push({ name, value }); });
  headers.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    finalUrl: finalRes.url || chain[chain.length - 1]?.url,
    status: finalRes.status,
    statusText: finalRes.statusText,
    redirects: chain.length - 1,
    chain,
    headers,
  });
}
