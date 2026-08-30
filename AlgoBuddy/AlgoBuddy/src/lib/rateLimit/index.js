import { Redis } from "@upstash/redis";
import { jwtVerify } from "jose";
import { getClientIp } from "../getClientIp.js";

const RATE_LIMIT_KEY_PREFIX = "rl";
const MAX_IN_MEMORY_ENTRIES = 10000;
const MEMORY_SWEEP_INTERVAL_MS = 60000;
const stores = []; // { store: Map, keyPrefix: string }

let memorySweepTimer = null;
function startMemorySweeper() {
  if (memorySweepTimer) return;
  memorySweepTimer = setInterval(() => {
    const now = Date.now();
    for (const entry of stores) {
      const store = entry.store;
      let expired = 0;
      for (const [key, bucket] of store.entries()) {
        if (bucket.resetAt <= now) {
          store.delete(key);
          expired++;
        }
      }
      if (store.size > MAX_IN_MEMORY_ENTRIES) {
        const toEvict = store.size - MAX_IN_MEMORY_ENTRIES;
        const iter = store.keys();
        for (let i = 0; i < toEvict; i++) {
          const k = iter.next().value;
          if (k !== undefined) store.delete(k);
        }
        console.warn(`[rateLimit] Evicted ${toEvict} entries: in-memory store exceeded ${MAX_IN_MEMORY_ENTRIES} limit (size=${store.size + toEvict}, expired=${expired})`);
      }
      if (store.size > MAX_IN_MEMORY_ENTRIES * 0.9) {
        console.warn(`[rateLimit] In-memory store near capacity: ${store.size}/${MAX_IN_MEMORY_ENTRIES}`);
      }
    }
  }, MEMORY_SWEEP_INTERVAL_MS);
  if (memorySweepTimer.unref) memorySweepTimer.unref();
}

const REDIS_REQUIRED = process.env.REDIS_REQUIRED === "true";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

if (!redis && REDIS_REQUIRED) {
  console.error("[rateLimit] REDIS_REQUIRED is set but Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) are missing. Rate limiting will fail requests.");
}

let isRedisOffline = false;
let redisOfflineUntil = 0;
const COOLDOWN_MS = 10000;

function markRedisOffline(err) {
  if (!isRedisOffline) {
    isRedisOffline = true;
    const msg = `[rateLimit] Redis connection failed, activating in-memory fallback. Error: ${err.message || err}`;
    if (REDIS_REQUIRED) {
      console.error(`[rateLimit] REDIS_REQUIRED=true — rate limiting will now reject requests until Redis recovers. ${msg}`);
    } else {
      console.error(msg);
    }
  }
  redisOfflineUntil = Date.now() + COOLDOWN_MS;
}

function markRedisOnline() {
  if (isRedisOffline) {
    isRedisOffline = false;
    console.log("[rateLimit] Redis connection restored, resuming Redis-based rate limiting.");
  }
}

function shouldTryRedis() {
  if (!redis) return false;
  if (!isRedisOffline) return true;
  if (Date.now() >= redisOfflineUntil) {
    return true;
  }
  return false;
}

async function resolveIdentityKey(request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token) {
      const jwksUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/jwks";
      const { createRemoteJWKSet } = await import("jose");
      const JWKS = createRemoteJWKSet(new URL(jwksUrl));
      const { payload } = await jwtVerify(token, JWKS);
      if (payload && payload.sub) {
        return `user:${payload.sub}`;
      }
    }
  } catch {}
  const ip = getClientIp(request.headers);
  return `ip:${ip}`;
}

export function createRateLimiter(options) {
  const { maxRequests, windowSeconds, prefix = "" } = options;
  const store = new Map();
  const keyPrefix = `${RATE_LIMIT_KEY_PREFIX}:${prefix}:`;
  stores.push({ store, keyPrefix });

  async function check(key) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const redisKey = `${keyPrefix}${key}`;

    if (shouldTryRedis()) {
      try {
        const uniqueMember = `${now}-${Math.random().toString(36).slice(2, 10)}`;
        const result = await redis
          .pipeline()
          .zadd(redisKey, { score: now, member: uniqueMember })
          .zremrangebyscore(redisKey, 0, now - windowMs)
          .zcard(redisKey)
          .expire(redisKey, windowSeconds)
          .exec();

        const count = result[2];
        if (count > maxRequests) {
          const oldestArray = await redis.zrange(redisKey, 0, 0);
          let oldest = now;
          if (oldestArray?.[0]) {
            const ts = Number(oldestArray[0].split("-")[0]);
            if (!isNaN(ts)) oldest = ts;
          }
          const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
          markRedisOnline();
          return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: now + retryAfter * 1000 };
        }
        markRedisOnline();
        return { allowed: true, remaining: Math.max(0, maxRequests - count), retryAfter: 0, resetAt: now + windowMs };
      } catch (err) {
        markRedisOffline(err);
      }
    }

    if (REDIS_REQUIRED) {
      const msg = `REDIS_REQUIRED=true and Redis is unavailable (offline=${isRedisOffline}, cooldown=${redisOfflineUntil > Date.now() ? Math.ceil((redisOfflineUntil - Date.now()) / 1000) + 's' : 'expired'}).`;
      console.error(`[rateLimit] ${msg}`);
      const retryAfter = 60;
      return { allowed: false, remaining: 0, retryAfter, resetAt: Date.now() + retryAfter * 1000 };
    }

    if (process.env.NODE_ENV === "production" && !redis) {
      console.warn("Critical: Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) are not configured in production. Using in-memory fallback.");
    }

    startMemorySweeper();

    const isOutage = redis && (isRedisOffline || Date.now() < redisOfflineUntil);
    const limit = isOutage ? Math.max(1, Math.floor(maxRequests * 0.5)) : maxRequests;

    const bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + windowMs;
      store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, retryAfter: 0, resetAt };
    }
    if (bucket.count >= limit) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: bucket.resetAt };
    }
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count, retryAfter: 0, resetAt: bucket.resetAt };
  }

  async function checkRequest(request) {
    const key = await resolveIdentityKey(request);
    const result = await check(key);
    if (!result.allowed) {
      const { NextResponse } = await import("next/server");
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Please wait ${result.retryAfter}s.`,
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + result.retryAfter),
          },
        }
      );
    }
    return null;
  }

  return { check, checkRequest };
}

export const authLimiter = createRateLimiter({ maxRequests: 5, windowSeconds: 60, prefix: "auth" });
export const apiLimiter = createRateLimiter({ maxRequests: 5, windowSeconds: 60, prefix: "api" });
export const sandboxLimiter = createRateLimiter({ maxRequests: 10, windowSeconds: 60, prefix: "sandbox" });
export const chatbotLimiter = createRateLimiter({ maxRequests: 10, windowSeconds: 60, prefix: "chatbot" });

export async function checkRateLimit(key) {
  return apiLimiter.check(key);
}

export async function checkChatbotRateLimit(key) {
  return chatbotLimiter.check(key);
}

export async function resetKey(key) {
  for (const entry of stores) {
    entry.store.delete(key);
    if (shouldTryRedis()) {
      try {
        await redis.del(`${entry.keyPrefix}${key}`);
        markRedisOnline();
      } catch (err) {
        markRedisOffline(err);
      }
    }
  }
}

export async function resetAll({ scope = "rate-limit" } = {}) {
  if (scope !== "rate-limit") {
    throw new Error("Invalid scope for resetAll");
  }
  isRedisOffline = false;
  redisOfflineUntil = 0;
  if (shouldTryRedis()) {
    try {
      let cursor = 0;
      const keysToDelete = [];
      do {
        const result = await redis.scan(cursor, {
          match: `${RATE_LIMIT_KEY_PREFIX}:*`,
          count: 100,
        });
        cursor = Number(result[0]);
        keysToDelete.push(...result[1]);
      } while (cursor !== 0);

      if (keysToDelete.length > 0) {
        for (let i = 0; i < keysToDelete.length; i += 100) {
          await redis.del(...keysToDelete.slice(i, i + 100));
        }
      }
      markRedisOnline();
    } catch (err) {
      markRedisOffline(err);
    }
  }
  for (const entry of stores) {
    entry.store.clear();
  }
}

let localSmtpCounter = 0;
let localSmtpDate = new Date().toISOString().split("T")[0];

const ATOMIC_SMTP_QUOTA_SCRIPT = `
  local dailyKey = KEYS[1]
  local maxPerDay = tonumber(ARGV[1])
  local current = redis.call('GET', dailyKey)
  if current and tonumber(current) >= maxPerDay then
    return 0
  end
  local newCount = redis.call('INCR', dailyKey)
  if newCount == 1 then
    redis.call('EXPIRE', dailyKey, 86400)
  end
  return newCount
`;

export async function checkGlobalSmtpQuota(maxPerDay = 500) {
  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[smtp-quota] Redis unavailable in production — SMTP quota not enforced across instances");
    }
    const today = new Date().toISOString().split("T")[0];
    if (localSmtpDate !== today) {
      localSmtpCounter = 0;
      localSmtpDate = today;
    }
    if (localSmtpCounter >= maxPerDay) {
      return { allowed: false, remaining: 0 };
    }
    localSmtpCounter += 1;
    const usagePercent = (localSmtpCounter / maxPerDay) * 100;
    if (usagePercent >= 80) {
      console.warn(`[smtp-quota] ${usagePercent.toFixed(0)}% of daily SMTP quota (${localSmtpCounter}/${maxPerDay}) consumed`);
    }
    return {
      allowed: true,
      remaining: Math.max(0, maxPerDay - localSmtpCounter),
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const dailyKey = `smtp:quota:${today}`;

  try {
    const result = await redis.eval(ATOMIC_SMTP_QUOTA_SCRIPT, [dailyKey], [maxPerDay]);

    if (result === 0) {
      return { allowed: false, remaining: 0 };
    }

    const newCount = Number(result);
    const usagePercent = (newCount / maxPerDay) * 100;
    if (usagePercent >= 80) {
      console.warn(`[smtp-quota] ${usagePercent.toFixed(0)}% of daily SMTP quota (${newCount}/${maxPerDay}) consumed`);
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxPerDay - newCount),
    };
  } catch (err) {
    console.error("[smtp-quota] Redis error, failing open:", err.message);
    return { allowed: true, remaining: 1, warning: "Redis error, quota not enforced" };
  }
}
