import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { getClientIP } from '@/lib/rate-limit';

// First-party pageview beacon. Privacy-first: no cookies; the visitor id is a
// daily-rotating salted hash of IP+UA (can't be linked across days or reversed).
export async function POST(req: Request) {
  try {
    const ua = req.headers.get('user-agent') || '';
    // Skip obvious bots — the whole point is to count real humans.
    if (/bot|crawl|spider|slurp|bing|headless|monitor|preview|lighthouse/i.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    const body = await req.json().catch(() => ({}));
    let path = String(body.path || '').slice(0, 512);
    if (!path.startsWith('/')) return new NextResponse(null, { status: 204 });
    // Never store query strings (may contain PII/tokens).
    path = path.split('?')[0];

    // Referrer: store host only, and never our own domain.
    let referrer: string | null = null;
    const ref = String(body.referrer || '').trim();
    if (ref) {
      try {
        const host = new URL(ref).hostname;
        if (host && !host.includes('seosnapshot.dev')) referrer = host.slice(0, 128);
      } catch { /* ignore bad referrer */ }
    }

    const ip = getClientIP(req);
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.NEXTAUTH_SECRET || 'salt';
    const visitorHash = createHash('sha256').update(`${salt}:${day}:${ip}:${ua}`).digest('hex').slice(0, 32);

    await prisma.pageView.create({ data: { path, referrer, visitorHash } });
    return new NextResponse(null, { status: 204 });
  } catch {
    // Analytics must never break the page.
    return new NextResponse(null, { status: 204 });
  }
}
