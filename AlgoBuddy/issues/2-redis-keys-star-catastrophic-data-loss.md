# `resetAll()` Uses `redis.keys("*")` Causing Catastrophic Cross-Component Data Loss

**Severity:** High  
**Component:** `src/lib/rateLimit/rateLimit.js`  
**Filed by:** (automated audit)  
**Existing issues:** None — issue #1034 covers a *different* rate-limiter problem (missing Redis fallback), not this bug.

---

## Summary

The `resetAll()` function in `rateLimit.js:151-164` uses `redis.keys("*")` to enumerate all keys before deleting them. This has two critical flaws:

1. **`keys("*")` matches every key in the Redis database**, not just rate-limit-prefixed keys. Calling `resetAll()` will destroy collaboration sessions, join-code mappings, session indices, and any other data stored in Redis — even data from other applications sharing the same Redis instance.
2. **`keys("*")` blocks the Redis event loop** for the duration of the scan. On a Redis instance with millions of keys (e.g., after extended production use), this can block all other operations for seconds or minutes.

## Root Cause

In `rateLimit.js:151-164`:

```js
async function resetAll() {
  if (redis) {
    try {
      const keys = await redis.keys("*");   // ← matches EVERYTHING
      if (keys && keys.length > 0) {
        await redis.del(...keys);            // ← deletes ALL keys
      }
    } catch {
      // Gracefully catch any redis errors during cleanup
    }
  }
  requestLog.clear();
}
```

The comment says "Attempt to clear rate limit keys in Redis (specifically prefixed or all if needed)". But there is no prefix filtering — the wildcard `"*"` matches all keys. There is also no confirmation guard, no permission check, and no parameter to scope which keys are cleared.

Compare with how other functions in this same file properly scope their keys:

| Function | Redis key pattern | Correctly scoped? |
|----------|-------------------|-------------------|
| `checkRateLimit` | `user:{id}` / `ip:{id}` | Yes (caller-provided) |
| `resetKey` | Caller-provided key | Yes |
| `resetAll` | `*` | **No** |

Meanwhile, the collaboration session store in `sessionStore.js` uses its own key namespace (`collab:session:*`, `collab:joinCode:*`, `collab:session:index`). These would all be destroyed by a call to `resetAll()`.

## When `resetAll()` Is Called

From `rateLimitMiddleware.js`, `resetAll()` is not directly called in production request paths. However:

- **Test teardown** — the JSDoc explicitly says "Call this in test teardown". If tests run against a shared Redis instance (e.g., staging), a single test run can wipe production collaboration data.
- **Admin tooling** — if any future admin panel or debugging script invokes this function, it silently destroys all Redis state.
- **Accidental import** — someone might call it from a migration script, seed script, or REPL.

The function is exported from the module and re-exported via `src/lib/rateLimit/index.js`, so any code that imports from `@/lib/rateLimit` has access.

## Impact

1. **Total loss of all collaboration sessions** — Every active or saved session, join-code mapping, and session index is deleted in a single call.
2. **Cross-tenant data loss** — If the Redis instance is shared across staging/production or multiple applications, all of them are wiped.
3. **Redis event-loop blocking** — On a production instance with hundreds of thousands of keys, `keys("*")` blocks all concurrent operations until it completes. `KEYS` documentation explicitly warns against using it in production.
4. **Silent failure** — The empty `catch` swallows any error, so there is no log output when this happens.

## Proposed Fix

### 1. Replace `keys("*")` with a scoped scan using a rate-limit key prefix

Define a constant prefix and use `SCAN` with pattern matching:

```js
const RATE_LIMIT_KEY_PREFIX = "rl:";  // or reuse the pattern from existing keys

async function resetAll() {
  if (redis) {
    try {
      let cursor = 0;
      const keysToDelete = [];
      do {
        const result = await redis.scan(cursor, {
          match: `${RATE_LIMIT_KEY_PREFIX}*`,
          count: 100,
        });
        cursor = Number(result[0]);
        keysToDelete.push(...result[1]);
      } while (cursor !== 0);

      if (keysToDelete.length > 0) {
        // Delete in batches to avoid oversized commands
        for (let i = 0; i < keysToDelete.length; i += 100) {
          await redis.del(...keysToDelete.slice(i, i + 100));
        }
      }
    } catch (err) {
      console.error("[rateLimit] Error during resetAll:", err);
    }
  }
  requestLog.clear();
}
```

This also requires updating the key format in `checkRateLimit` to consistently use the prefix.

### 2. Guard `resetAll` with an explicit parameter

Require an explicit confirmation or scope parameter to prevent accidental calls:

```js
async function resetAll({ scope = "rate-limit" } = {}) {
  if (scope !== "rate-limit") {
    throw new Error("Invalid scope for resetAll");
  }
  // ...
}
```

### 3. Update checkRateLimit to use the same prefix

Ensure `checkRateLimit` stores keys under `rl:user:{id}` or `rl:ip:{id}` so that `resetAll` can target only rate-limit keys:

```js
// In checkRateLimit
const redisKey = `rl:${key}`;
```

## Code Locations

| File | Lines | Description |
|------|-------|-------------|
| `src/lib/rateLimit/rateLimit.js` | 151-164 | `resetAll()` function using `redis.keys("*")` |
| `src/lib/rateLimit/rateLimit.js` | 46-132 | `checkRateLimit()` — needs key prefix for scoped matching |
| `src/lib/rateLimit/rateLimit.js` | 1-9 | Top of file — needs `RATE_LIMIT_KEY_PREFIX` constant |
| `src/lib/rateLimit/rateLimitMiddleware.js` | (all) | Consumers of rate limit (indirectly affected) |

## Estimated Change Size

- ~15 lines in `rateLimit.js` (prefix constant, key format update, scoped `resetAll`)
- ~5 lines in `rateLimitMiddleware.js` if `resolveIdentityKey` key format is adjusted
