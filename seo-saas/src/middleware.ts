import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting for middleware
// Note: This resets on each serverless cold start. For production, use Redis.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitResult(ip: string, limit: number, windowSec: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Per-minute burst limit for /api/analyze (the per-day quota lives in the
  // route handler, backed by Redis). This is an in-memory guard against bursts.
  const BURST_LIMIT = 20;
  const BURST_WINDOW_SEC = 60;

  if (pathname === '/api/analyze') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '0.0.0.0';

    const result = getRateLimitResult(`analyze:${ip}`, BURST_LIMIT, BURST_WINDOW_SEC);

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter || BURST_WINDOW_SEC),
            'X-RateLimit-Limit': String(BURST_LIMIT),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(BURST_LIMIT));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    return response;
  }

  // Security headers for all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/api/analyze', '/api/monitor'],
};
