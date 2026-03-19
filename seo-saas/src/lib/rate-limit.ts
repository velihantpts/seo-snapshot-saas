// In-memory sliding window rate limiter
// For production with multiple instances, replace with Redis (Upstash)

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000; // cleanup every minute

// Periodic cleanup of expired entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      entry.timestamps = entry.timestamps.filter(t => now - t < 86_400_000);
      if (entry.timestamps.length === 0) store.delete(key);
    });
  }, CLEANUP_INTERVAL);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number = 86_400_000 // default: 24 hours
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, limit, retryAfter };
  }

  entry.timestamps.push(now);
  store.set(identifier, entry);

  return { allowed: true, remaining: limit - entry.timestamps.length, limit };
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return '0.0.0.0';
}
