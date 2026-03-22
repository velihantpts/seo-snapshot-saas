// Mock Redis before importing cache
jest.mock('../src/lib/redis', () => {
  const store = new Map<string, { value: string; expiry: number }>();
  return {
    redis: {
      get: jest.fn(async (key: string) => {
        const entry = store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiry) { store.delete(key); return null; }
        return entry.value;
      }),
      set: jest.fn(async (key: string, value: string, _ex: string, ttl: number) => {
        store.set(key, { value, expiry: Date.now() + ttl * 1000 });
        return 'OK';
      }),
      del: jest.fn(async (key: string) => {
        store.delete(key);
        return 1;
      }),
    },
  };
});

import { getCache, setCache, deleteCache } from '../src/lib/cache';

describe('Cache Layer', () => {
  test('returns null for missing key', async () => {
    const result = await getCache('nonexistent');
    expect(result).toBeNull();
  });

  test('stores and retrieves a value', async () => {
    await setCache('test-key', { score: 85, url: 'https://example.com' });
    const result = await getCache<{ score: number; url: string }>('test-key');
    expect(result).toEqual({ score: 85, url: 'https://example.com' });
  });

  test('deletes a cached value', async () => {
    await setCache('to-delete', { data: true });
    await deleteCache('to-delete');
    const result = await getCache('to-delete');
    expect(result).toBeNull();
  });

  test('handles complex objects', async () => {
    const complex = {
      url: 'https://example.com',
      score: 92,
      issues: [{ severity: 'warning', problem: 'test', fix: 'fix it' }],
      nested: { a: { b: { c: 123 } } },
    };
    await setCache('complex', complex);
    const result = await getCache('complex');
    expect(result).toEqual(complex);
  });
});
