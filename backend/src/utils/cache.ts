import redis from '../lib/redis';

export const TTL_24H = 24 * 60 * 60;
export const TTL_1H = 60 * 60;

export async function getCached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  if (redis) {
    try {
      const hit = await redis.get(key);
      if (hit !== null) return JSON.parse(hit) as T;
    } catch {
      // fall through to DB on any Redis error
    }
  }

  const data = await fn();

  if (redis) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch {
      // ignore write failures — data is still returned
    }
  }

  return data;
}

export async function flushCache(): Promise<void> {
  if (!redis) return;
  await redis.flushdb();
}
