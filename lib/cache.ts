import { Redis } from "@upstash/redis";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

type MemoryEntry = { value: unknown; expiresAt: number };
const memoryCache = new Map<string, MemoryEntry>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const value = await redis.get<T>(key);
      return value ?? null;
    } catch (e) {
      console.warn("[cache] redis get failed, falling back to memory", e);
    }
  }
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    } catch (e) {
      console.warn("[cache] redis set failed, falling back to memory", e);
    }
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export const TTL = {
  SEARCH: 6 * 60 * 60,
  LOOKUP: 24 * 60 * 60,
  OFFSTORE: 60 * 60,
} as const;
