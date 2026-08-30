/**
 * Unit and integration tests for Redis rate-limiter fallback/outage behavior.
 * Uses node:test runner for seamless ESM support and zero configuration dependencies.
 */

const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

// Pre-configure environment variables so that Redis connection is attempted
process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";
process.env.SUPABASE_JWT_SECRET = "mock-jwt-secret-for-testing-only-12345";
process.env.NODE_ENV = "production";

// Set up mock Redis state
let mockRedisInstance = {
  pipeline: () => mockPipeline,
  zrange: async () => [],
  del: async () => 1,
  scan: async () => [0, []],
  incr: async () => 1,
  expire: async () => 1,
};

let mockPipeline = {
  zadd: () => mockPipeline,
  zremrangebyscore: () => mockPipeline,
  zcard: () => mockPipeline,
  expire: () => mockPipeline,
  exec: async () => [null, null, 1, null] // 1 request allowed
};

const rateLimitUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "rateLimit", "index.js"),
).href;

async function loadRateLimiter() {
  const upstashRedisModule = await import("@upstash/redis");
  const { Redis } = upstashRedisModule;
  Redis.fromEnv = () => mockRedisInstance;
  return import(rateLimitUrl);
}

beforeEach(async () => {
  const { resetAll } = await loadRateLimiter();
  await resetAll();
});

test("Redis rate limiter - Redis available (happy path)", async () => {
  const { createRateLimiter } = await loadRateLimiter();
  const limiter = createRateLimiter({ maxRequests: 5, windowSeconds: 60 });

  // Mock Redis returns count = 1
  mockPipeline.exec = async () => [null, null, 1, null];

  const res = await limiter.check("test-user-happy");
  assert.equal(res.allowed, true);
  assert.equal(res.remaining, 4);
});

test("Redis rate limiter - Redis unavailable at startup (graceful fallback)", async () => {
  const { createRateLimiter } = await loadRateLimiter();
  const limiter = createRateLimiter({ maxRequests: 10, windowSeconds: 60 });

  // Simulate startup failure - exec throws connection error
  mockPipeline.exec = async () => {
    throw new Error("Redis connection timed out (mock startup failure)");
  };

  const res = await limiter.check("test-user-startup");
  // Outage fallback should activate, limit becomes 50% of 10 = 5.
  // First request should be allowed.
  assert.equal(res.allowed, true);
  assert.equal(res.remaining, 4); // 5 (conservative limit) - 1
});

test("Redis rate limiter - Redis becomes unavailable during runtime and recovers", async () => {
  const { createRateLimiter } = await loadRateLimiter();
  const limiter = createRateLimiter({ maxRequests: 6, windowSeconds: 60 });

  // 1. Start with Redis online
  mockPipeline.exec = async () => [null, null, 1, null];
  let res = await limiter.check("test-user-runtime");
  assert.equal(res.allowed, true, "Should allow when online");
  assert.equal(res.remaining, 5, "Remaining should be 5 when online");

  // 2. Redis goes down
  mockPipeline.exec = async () => {
    throw new Error("Connection reset by peer (mock runtime failure)");
  };
  res = await limiter.check("test-user-runtime");
  // Falls back to in-memory, conservative limit is 50% of 6 = 3.
  // This is the first request handled in-memory, so memory count = 1.
  // Remaining should be 3 - 1 = 2.
  assert.equal(res.allowed, true, "Should still allow request via fallback");
  assert.equal(res.remaining, 2, "Remaining should use conservative limit (3 - 1 = 2)");

  // 3. Try again, should bypass Redis due to cooldown circuit breaker
  let callCount = 0;
  mockPipeline.exec = async () => {
    callCount++;
    return [null, null, 1, null];
  };
  
  res = await limiter.check("test-user-runtime");
  assert.equal(callCount, 0, "Should not hit Redis due to circuit breaker cooldown");
  assert.equal(res.allowed, true);

  // 4. Advance time past the 10-second cooldown (mock Date.now)
  const realDateNow = Date.now;
  Date.now = () => realDateNow() + 11000;

  res = await limiter.check("test-user-runtime");
  assert.equal(callCount, 1, "Should attempt to reach Redis after cooldown expired");
  assert.equal(res.allowed, true, "Should recover and allow requests using Redis again");
  assert.equal(res.remaining, 5, "Remaining count should be restored to normal limits");

  // Restore Date.now
  Date.now = realDateNow;
});
