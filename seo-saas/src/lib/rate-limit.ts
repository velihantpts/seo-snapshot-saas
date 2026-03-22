import { redis } from './redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number = 86_400_000 // default: 24 hours
): Promise<RateLimitResult> {
  const key = `rl:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Redis sliding window: sorted set with timestamp as score
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart); // remove expired
    pipeline.zadd(key, now, `${now}:${Math.random()}`); // add current
    pipeline.zcard(key); // count in window
    pipeline.pexpire(key, windowMs); // set TTL
    const results = await pipeline.exec();

    const count = (results?.[2]?.[1] as number) || 0;

    if (count > limit) {
      // Over limit — remove the entry we just added
      await redis.zremrangebyscore(key, now, now);
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTime = oldest.length >= 2 ? parseInt(oldest[1]) : now;
      const retryAfter = Math.ceil((oldestTime + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, limit, retryAfter };
    }

    return { allowed: true, remaining: limit - count, limit };
  } catch {
    // Redis down — fallback to allow (fail-open)
    return { allowed: true, remaining: limit, limit };
  }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return '0.0.0.0';
}
