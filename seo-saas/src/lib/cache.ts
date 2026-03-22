import { redis } from './redis';

const DEFAULT_TTL = 3600; // 1 hour

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
  try {
    await redis.set(`cache:${key}`, JSON.stringify(value), 'EX', ttl);
  } catch {
    // Cache write failure is non-critical
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(`cache:${key}`);
  } catch {
    // Cache delete failure is non-critical
  }
}
