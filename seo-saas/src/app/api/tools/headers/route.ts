import { NextResponse } from 'next/server';
import { validateTargetURL } from '@/lib/ssrf-protection';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface HeaderResult {
  name: string;
  present: boolean;
  value: string | null;
  advice: string;
  fix: string;
}

const FIXES: Record<string, string> = {
  'Strict-Transport-Security': 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;',
  'Content-Security-Policy': 'add_header Content-Security-Policy "default-src \'self\'; img-src \'self\' data:; frame-ancestors \'self\'; base-uri \'self\'" always;',
  'X-Frame-Options': 'add_header X-Frame-Options "SAMEORIGIN" always;',
  'X-Content-Type-Options': 'add_header X-Content-Type-Options "nosniff" always;',
  'Referrer-Policy': 'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
  'Permissions-Policy': 'add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;',
};

export async function POST(req: Request) {
  const clientIP = getClientIP(req);
  let body: { url?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (!body.url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  // SSRF protection — never fetch internal/loopback targets.
  const validation = validateTargetURL(body.url);
  if (!validation.valid || !validation.url) {
    return NextResponse.json({ error: validation.error || 'Invalid URL' }, { status: 400 });
  }
  const target = validation.url.toString();

  const rate = await checkRateLimit(`headers:ip:${clientIP}`, 40, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many checks. Try again in a bit.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter || 3600) } });
  }

  let res: Response;
  try {
    res = await fetch(target, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'SEOSnapshot-HeaderChecker/1.0 (+https://seosnapshot.dev)' },
    });
  } catch (err) {
    const msg = (err as Error)?.message?.toLowerCase() || '';
    let userMessage = 'Could not reach that URL.';
    if (msg.includes('abort') || msg.includes('timeout')) userMessage = 'The site took too long to respond (timeout).';
    else if (msg.includes('enotfound') || msg.includes('dns')) userMessage = 'Could not resolve the domain — check for typos.';
    else if (msg.includes('cert') || msg.includes('ssl') || msg.includes('tls')) userMessage = 'The site has an SSL/TLS certificate error.';
    return NextResponse.json({ error: userMessage }, { status: 502 });
  }

  const finalUrl = res.url || target;
  const isHttps = finalUrl.startsWith('https://');
  const get = (h: string) => res.headers.get(h);

  const hsts = get('strict-transport-security');
  const csp = get('content-security-policy');
  const hstsMaxAge = hsts ? parseInt(/max-age=(\d+)/.exec(hsts)?.[1] || '0') : 0;
  const results: HeaderResult[] = [
    { name: 'Strict-Transport-Security', present: !!hsts, value: hsts, advice: hsts ? (hstsMaxAge >= 31536000 ? 'Good — long max-age set.' : 'Present, but raise max-age to at least 31536000 (1 year).') : 'Missing — forces HTTPS and blocks downgrade attacks.', fix: FIXES['Strict-Transport-Security'] },
    { name: 'Content-Security-Policy', present: !!csp, value: csp, advice: csp ? (csp.includes('unsafe-inline') || csp.includes('unsafe-eval') ? 'Present, but allows unsafe-inline/eval — tighten it.' : 'Good — a policy is set.') : 'Missing — the strongest defense against XSS.', fix: FIXES['Content-Security-Policy'] },
    { name: 'X-Frame-Options', present: !!get('x-frame-options'), value: get('x-frame-options'), advice: get('x-frame-options') ? 'Good — clickjacking protection is set.' : 'Missing — prevents your site being framed (clickjacking).', fix: FIXES['X-Frame-Options'] },
    { name: 'X-Content-Type-Options', present: !!get('x-content-type-options'), value: get('x-content-type-options'), advice: get('x-content-type-options') ? 'Good — MIME sniffing is disabled.' : 'Missing — add "nosniff" to stop MIME-type sniffing.', fix: FIXES['X-Content-Type-Options'] },
    { name: 'Referrer-Policy', present: !!get('referrer-policy'), value: get('referrer-policy'), advice: get('referrer-policy') ? 'Good — referrer leakage is controlled.' : 'Missing — controls how much referrer data leaks to other sites.', fix: FIXES['Referrer-Policy'] },
    { name: 'Permissions-Policy', present: !!get('permissions-policy'), value: get('permissions-policy'), advice: get('permissions-policy') ? 'Good — browser features are restricted.' : 'Missing — restrict camera, microphone, geolocation.', fix: FIXES['Permissions-Policy'] },
  ];

  // Grade — same weighting as the site analyzer for consistency.
  let points = 0;
  if (isHttps) points += 20;
  if (hstsMaxAge >= 31536000) points += 15;
  if (hsts?.includes('includeSubDomains')) points += 5;
  if (csp && !csp.includes('unsafe-inline') && !csp.includes('unsafe-eval')) points += 15;
  else if (csp) points += 5;
  if (get('x-frame-options')) points += 10;
  if (get('x-content-type-options')) points += 10;
  if (get('referrer-policy')) points += 10;
  if (get('permissions-policy')) points += 5;
  points += 10; // baseline (mixed content not evaluated from headers alone)

  const grade = points >= 90 ? 'A+' : points >= 70 ? 'A' : points >= 50 ? 'B' : points >= 30 ? 'C' : points >= 18 ? 'D' : 'F';

  return NextResponse.json({ url: finalUrl, https: isHttps, status: res.status, grade, points, headers: results });
}
