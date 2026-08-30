import { Redis } from "@upstash/redis";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { resolveClientId } from "../getClientIp.js";
import { createLogger } from "../logger.js";

const log = createLogger("rateLimit");

const RATE_LIMIT_KEY_PREFIX = "rl";
const stores = []; // { store: Map, keyPrefix: string }

// Lazy per-request cleanup — Redis handles TTL expiry via EXPIRE.
// The check() function cleans expired entries when accessed.
const REDIS_REQUIRED = process.env.REDIS_REQUIRED === "true";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

if (!redis && REDIS_REQUIRED) {
  log.error("REDIS_REQUIRED is set but Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) are missing. Rate limiting will fail requests.");
}

let isRedisOffline = false;
let redisOfflineUntil = 0;
const COOLDOWN_MS = 10000;

function markRedisOffline(err) {
  if (!isRedisOffline) {
    isRedisOffline = true;
    const msg = `Redis connection failed, activating in-memory fallback. Error: ${err.message || err}`;
    if (REDIS_REQUIRED) {
      log.error({ err }, `REDIS_REQUIRED=true — rate limiting will now reject requests until Redis recovers. ${msg}`);
    } else {
      log.error({ err }, msg);
    }
  }
  redisOfflineUntil = Date.now() + COOLDOWN_MS;
}

function markRedisOnline() {
  if (isRedisOffline) {
    isRedisOffline = false;
    log.info("Redis connection restored, resuming Redis-based rate limiting.");
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

// Lazily created and cached so we don't hit Supabase's JWKS endpoint on
// every single request — createRemoteJWKSet() caches keys internally.
let cachedJWKS = null;
function getSupabaseJWKS() {
  if (!cachedJWKS) {
    // NOTE: this MUST match the endpoint Supabase actually serves its
    // JWKS from (see backend/.../SecurityConfig.java#jwtDecoder for the
    // Java side using the same URL). 
    const jwksUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/auth/v1/.well-known/jwks.json";
    cachedJWKS = createRemoteJWKSet(new URL(jwksUrl));
  }
  return cachedJWKS;
}

async function resolveIdentityKey(request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (token) {
    try {
      const JWKS = getSupabaseJWKS();
      const { payload } = await jwtVerify(token, JWKS);
      if (payload && payload.sub) {
        return `user:${payload.sub}`;
      }
    } catch (err) {
      // A present-but-invalid/expired token is not the same as "no token
      // provided" — log it distinctly so a regression here (e.g. a wrong
      // JWKS URL) is visible instead of silently degrading every limiter
      // to IP-based keying with no signal anywhere.
      log.warn({ err }, "JWT verification failed, falling back to IP-based key.");
    }
  }
  const clientId = resolveClientId(request.headers);
  return `ip:${clientId}`;
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
        const uuidPart = typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID
          ? globalThis.crypto.randomUUID().split("-")[0]
          : Math.random().toString(36).substring(2, 10);
        const uniqueMember = `${now}-${uuidPart}`;
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
      log.error({ isRedisOffline, cooldownSecondsLeft: redisOfflineUntil > Date.now() ? Math.ceil((redisOfflineUntil - Date.now()) / 1000) : 0 }, "REDIS_REQUIRED=true and Redis is unavailable.");
      const retryAfter = 60;
      return { allowed: false, remaining: 0, retryAfter, resetAt: Date.now() + retryAfter * 1000 };
    }

    if (process.env.NODE_ENV === "production" && !redis) {
      log.warn("Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) not configured in production. Using in-memory fallback.");
    }

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

export function shouldBypassRateLimit() {
  return process.env.DISABLE_RATE_LIMIT === "true";
}

const dynamicLimiters = new Map();

export async function checkRateLimit(key, maxRequests, windowSeconds) {
  if (shouldBypassRateLimit()) {
    return { allowed: true, remaining: 999, retryAfter: 0 };
  }
  if (maxRequests !== undefined && windowSeconds !== undefined) {
    const cacheKey = `${maxRequests}:${windowSeconds}`;
    if (!dynamicLimiters.has(cacheKey)) {
      dynamicLimiters.set(cacheKey, createRateLimiter({
        maxRequests,
        windowSeconds,
        prefix: `dynamic-${cacheKey}`
      }));
    }
    return dynamicLimiters.get(cacheKey).check(key);
  }
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
      log.warn("Redis unavailable in production — SMTP quota not enforced across instances.");
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
      log.warn({ usagePercent: usagePercent.toFixed(0), used: localSmtpCounter, maxPerDay }, "Daily SMTP quota threshold reached.");
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
      log.warn({ usagePercent: usagePercent.toFixed(0), used: newCount, maxPerDay }, "Daily SMTP quota threshold reached.");
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxPerDay - newCount),
    };
  } catch (err) {
    log.error({ err }, "SMTP quota Redis error, failing open.");
    return { allowed: true, remaining: 1, warning: "Redis error, quota not enforced" };
  }
}
