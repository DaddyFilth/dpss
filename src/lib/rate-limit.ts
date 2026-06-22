import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let rateLimiters: Map<string, Ratelimit> = new Map();

function getRedis(): Redis | null {
  if (redis) return redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

function getRateLimiter(endpoint: string, limit: number, windowMs: number): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  const key = `${endpoint}:${limit}:${windowMs}`;
  if (rateLimiters.has(key)) {
    return rateLimiters.get(key)!;
  }

  const windowSeconds = Math.ceil(windowMs / 1000);
  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix: `ratelimit:${endpoint}`,
  });

  rateLimiters.set(key, limiter);
  return limiter;
}

// In-memory fallback store
interface MemoryRateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryRateLimitStore>();

async function memoryRateLimit(
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();

  // Clean up expired entries periodically
  if (memoryStore.size > 1000) {
    for (const [storeKey, data] of memoryStore.entries()) {
      if (data.resetTime < now) {
        memoryStore.delete(storeKey);
      }
    }
  }

  const entry = memoryStore.get(key);

  if (!entry || entry.resetTime < now) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

/**
 * Rate limit using Redis (Upstash) when available, falling back to in-memory.
 */
export async function rateLimitRedis(
  identifier: string,
  endpoint: string,
  limit: number = 100,
  windowMs: number = 900000
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const limiter = getRateLimiter(endpoint, limit, windowMs);

  if (limiter) {
    const result = await limiter.limit(`${identifier}:${endpoint}`);
    return {
      success: result.success,
      remaining: result.remaining,
      resetTime: result.reset,
    };
  }

  return memoryRateLimit(identifier, endpoint, limit, windowMs);
}
