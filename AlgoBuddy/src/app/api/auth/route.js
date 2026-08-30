import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { jsonResponse, errorResponse, getSupabaseAdmin } from "@/lib/serverApi";

function getValidUrl(value) {
  if (!value) return null;
  let trimmed = String(value).trim();
  if (!trimmed || trimmed.startsWith("Your ")) return null;
  if (trimmed.startsWith("http://localhost:")) {
    trimmed = trimmed.replace("http://localhost:", "http://127.0.0.1:");
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

function getValidKey(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed && !trimmed.startsWith("Your ") ? trimmed : null;
}

const supabaseUrl = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceKey = getValidKey(process.env.SUPABASE_SERVICE_KEY);

let supabaseAdmin = null;
try { supabaseAdmin = getSupabaseAdmin(); } catch { supabaseAdmin = null; }

const AUTH_RATE_LIMIT_PREFIX = "auth";

const LOGIN_FAILURE_WINDOW_SECONDS = 15 * 60; // 15 minutes
const LOGIN_FAILURE_THRESHOLD = 5; // lock after 5 failed attempts
const LOGIN_LOCK_SECONDS = 15 * 60; // 15 minutes lockout

const MAX_MEMORY_LOCKOUTS = 5000;
const MAX_MEMORY_FAILURES = 5000;

// In-memory fallback for local dev (single instance). Not suitable for serverless scaling.
const memoryLockouts = new Map(); // email -> until timestamp
const memoryFailures = new Map(); // email -> { count, resetAt }
const memoryLocks = new Map(); // email -> boolean (per-email mutex)

async function acquireMemoryLock(key, timeoutMs = 2000) {
  const start = Date.now();
  while (memoryLocks.get(key) === true) {
    if (Date.now() - start > timeoutMs) return false;
    await new Promise(r => setTimeout(r, 5));
  }
  memoryLocks.set(key, true);
  return true;
}

function releaseMemoryLock(key) {
  memoryLocks.delete(key);
}

// Periodic sweeper to clean up expired entries (replaces probabilistic GC)
const MEMORY_SWEEP_INTERVAL_MS = 60_000;
let memorySweepTimer = null;

function startMemorySweeper() {
  if (memorySweepTimer) return;
  memorySweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, until] of memoryLockouts.entries()) {
      if (until <= now) memoryLockouts.delete(k);
    }
    for (const [k, bucket] of memoryFailures.entries()) {
      if (bucket.resetAt <= now) memoryFailures.delete(k);
    }
    // memoryLockouts is exempt from size-based eviction to prevent brute-force
    // bypass (an attacker flooding dummy emails should not flush a target's lockout).
    // OOM risk is low since lockouts require 5 consecutive failures before creation.
    // memoryFailures gets size limits to bound the higher-volume failure tracking.
    if (memoryFailures.size > MAX_MEMORY_FAILURES) {
      const toEvict = memoryFailures.size - MAX_MEMORY_FAILURES;
      const iter = memoryFailures.keys();
      for (let i = 0; i < toEvict; i++) {
        const k = iter.next().value;
        if (k !== undefined) memoryFailures.delete(k);
      }
      console.warn(`[auth] Evicted ${toEvict} failure entries: exceeded ${MAX_MEMORY_FAILURES} limit`);
    }
    const totalMemoryEntries = memoryLockouts.size + memoryFailures.size + memoryLocks.size;
    if (totalMemoryEntries > 0) {
      console.log(`[auth] Memory state: lockouts=${memoryLockouts.size}, failures=${memoryFailures.size}, locks=${memoryLocks.size}`);
    }
  }, MEMORY_SWEEP_INTERVAL_MS);
  if (memorySweepTimer.unref) memorySweepTimer.unref();
}

startMemorySweeper();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

let isRedisOffline = false;
let redisOfflineUntil = 0;
const COOLDOWN_MS = 10000;

function markRedisOffline(err) {
  if (!isRedisOffline) {
    isRedisOffline = true;
    console.error(`[auth] Redis connection failed, activating in-memory fallback. Error: ${err.message || err}`);
  }
  redisOfflineUntil = Date.now() + COOLDOWN_MS;
}

function markRedisOnline() {
  if (isRedisOffline) {
    isRedisOffline = false;
    console.log("[auth] Redis connection restored, resuming Redis-based auth lockout.");
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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function lockKey(email) {
  return `${AUTH_RATE_LIMIT_PREFIX}:lock:${email}`;
}

function failKey(email) {
  return `${AUTH_RATE_LIMIT_PREFIX}:fail:${email}`;
}

async function isEmailLocked(email) {
  if (!email) return false;

  if (shouldTryRedis()) {
    try {
      const value = await redis.get(lockKey(email));
      markRedisOnline();
      return Boolean(value);
    } catch (err) {
      markRedisOffline(err);
    }
  }

  const lockKeyMem = `auth:lock:${email}`;
  const acquired = await acquireMemoryLock(lockKeyMem);
  if (!acquired) return false;
  try {
    const until = memoryLockouts.get(email);
    if (!until) return false;
    if (until <= Date.now()) {
      memoryLockouts.delete(email);
      return false;
    }
    return true;
  } finally {
    releaseMemoryLock(lockKeyMem);
  }
}

async function recordLoginFailure(email) {
  if (!email) return { locked: false, remaining: LOGIN_FAILURE_THRESHOLD };

  if (shouldTryRedis()) {
    try {
      const attempts = await redis.incr(failKey(email));
      if (attempts === 1) {
        await redis.expire(failKey(email), LOGIN_FAILURE_WINDOW_SECONDS);
      }
      const remaining = Math.max(0, LOGIN_FAILURE_THRESHOLD - attempts);
      if (attempts >= LOGIN_FAILURE_THRESHOLD) {
        await redis.set(lockKey(email), "1", { ex: LOGIN_LOCK_SECONDS });
        await redis.del(failKey(email));
        markRedisOnline();
        return { locked: true, remaining: 0 };
      }
      markRedisOnline();
      return { locked: false, remaining };
    } catch (err) {
      markRedisOffline(err);
    }
  }

  const lockKeyMem = `auth:fail:${email}`;
  const acquired = await acquireMemoryLock(lockKeyMem);
  if (!acquired) return { locked: false, remaining: LOGIN_FAILURE_THRESHOLD };

  try {
    const now = Date.now();
    const bucket = memoryFailures.get(email);
    if (!bucket || bucket.resetAt <= now) {
      memoryFailures.set(email, { count: 1, resetAt: now + LOGIN_FAILURE_WINDOW_SECONDS * 1000 });
      return { locked: false, remaining: LOGIN_FAILURE_THRESHOLD - 1 };
    }
    bucket.count += 1;
    const remaining = Math.max(0, LOGIN_FAILURE_THRESHOLD - bucket.count);
    if (bucket.count >= LOGIN_FAILURE_THRESHOLD) {
      memoryFailures.delete(email);
      memoryLockouts.set(email, now + LOGIN_LOCK_SECONDS * 1000);
      return { locked: true, remaining: 0 };
    }
    return { locked: false, remaining };
  } finally {
    releaseMemoryLock(lockKeyMem);
  }
}

async function clearLoginFailures(email) {
  if (!email) return;
  if (shouldTryRedis()) {
    try {
      await redis.del(failKey(email));
      await redis.del(lockKey(email));
      markRedisOnline();
      return;
    } catch (err) {
      markRedisOffline(err);
    }
  }

  const lockKeyMem = `auth:clear:${email}`;
  const acquired = await acquireMemoryLock(lockKeyMem);
  if (!acquired) return;
  try {
    memoryFailures.delete(email);
    memoryLockouts.delete(email);
  } finally {
    releaseMemoryLock(lockKeyMem);
  }
}

function genericAuthError() {
  // Prevent account enumeration by not reflecting upstream messages.
  return "Invalid email or password.";
}

export async function POST(req) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
    if (isProduction && !hasRedis) {
      console.warn("Production environment is missing Redis variables; using in-memory rate limiters/lockouts.");
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ success: false, message: "Invalid request body" }, 400);
    }

    const { email, password, captchaToken, action, name } = body || {};

    if (!email || !password) {
      return jsonResponse({ success: false, message: "Email and password are required" }, 400);
    }

    if (!captchaToken) {
      return jsonResponse({ success: false, message: "Captcha token missing" }, 400);
    }

    const ip = getClientIp(req.headers);

    const explicitBypass = process.env.TURNSTILE_BYPASS === "true";
    let captcha;

    if (explicitBypass) {
      captcha = { ok: true };
    } else {
      try {
        captcha = await verifyTurnstile(String(captchaToken), { ip });
      } catch (err) {
        if (err.message === 'CAPTCHA_CONFIG_MISSING') {
          if (!isProduction) {
            console.warn("TURNSTILE_SECRET_KEY is not configured. Skipping captcha verification. This should only be used for local development.");
            captcha = { ok: true };
          } else {
            console.error("Server misconfigured: CAPTCHA secret key is not set.");
            return jsonResponse({ success: false, message: "We're having trouble verifying the CAPTCHA. Please try again later." }, 500);
          }
        } else {
          throw err;
        }
      }
    }

    if (!captcha.ok) {
      return jsonResponse({ success: false, message: captcha.error || "Captcha verification failed. Please try again." }, 400);
    }

    const normalizedEmail = normalizeEmail(email);
    const actionName = action === "signup" ? "signup" : "login";

    const [ipLimit, emailLimit] = await Promise.all([
      checkRateLimit(`${AUTH_RATE_LIMIT_PREFIX}:${actionName}:ip:${ip}`),
      checkRateLimit(`${AUTH_RATE_LIMIT_PREFIX}:${actionName}:email:${normalizedEmail}`),
    ]);

    if (!ipLimit.allowed || !emailLimit.allowed) {
      return jsonResponse({ success: false, message: "Too many attempts. Please wait and try again." }, 429);
    }

    if (action === "signup") {
      const serviceKey = getValidKey(process.env.SUPABASE_SERVICE_KEY);
      if (!supabaseUrl || !serviceKey) {
        return jsonResponse({ success: false, message: "Auth server is not configured." }, 500);
      }

      const admin = getSupabaseAdmin();

      const emailConfirm = process.env.AUTO_CONFIRM_EMAIL === "true";

      const { error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: emailConfirm,
        user_metadata: { display_name: name },
      });

      if (error) {
        return jsonResponse({ success: false, message: error.message }, 400);
      }

      if (emailConfirm) {
        return jsonResponse({
          success: true,
          message: "Signup successful. You can now log in!",
          trigger: true,
        });
      }

      return jsonResponse({
        success: true,
        message: "Signup successful! Please check your email to verify your account before logging in.",
        trigger: false,
      });
    }

    if (action === "login") {
      if (await isEmailLocked(normalizedEmail)) {
        return jsonResponse({ success: false, message: "Too many failed login attempts. Please try again later." }, 429);
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        return jsonResponse({ success: false, message: "Auth server is not configured." }, 500);
      }

      const cookieStore = await cookies();

      const client = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, {
                  ...options,
                  sameSite: 'strict',
                  secure: process.env.NODE_ENV === 'production',
                });
              });
            },
          },
        },
      );

      const { error } = await client.auth.signInWithPassword({ email, password });

      if (error) {
        const { locked } = await recordLoginFailure(normalizedEmail);
        return jsonResponse({
          success: false,
          message: locked
            ? "Too many failed login attempts. Please try again later."
            : genericAuthError(),
        }, 401);
      }

      await clearLoginFailures(normalizedEmail);

      return jsonResponse({ success: true, message: "Login successful" });
    }

    return jsonResponse({ success: false, message: "Invalid action" }, 400);
  } catch (err) {
    console.error("Auth API error:", err);
    return jsonResponse({ success: false, message: "Internal server error" }, 500);
  }
}
