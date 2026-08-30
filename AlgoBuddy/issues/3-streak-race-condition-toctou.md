# Concurrent Practice Streak Update Race Condition (TOCTOU)

**Severity:** High  
**Component:** `backend/src/main/java/com/algobuddy/backend/service/PracticeService.java`  
**Filed by:** (automated audit)  
**Existing issues:** None.

---

## Summary

The `updateStreak` method in `PracticeService.java:143-167` has a classic time-of-check-to-time-of-use (TOCTOU) race condition. When a user completes two or more problems in rapid succession (or submits a bulk update while a single update is in flight), concurrent threads can read stale streak data, compute the same incremented value, and overwrite each other's results — silently corrupting the user's streak.

## Root Cause

In `PracticeService.java:143-167`:

```java
private void updateStreak(UUID userId) {
    // READ
    UserPracticeStats stats = statsRepository.findById(userId)
            .orElse(new UserPracticeStats(userId, 0, 0, null, 0));

    LocalDate today = LocalDate.now();
    LocalDate lastActive = stats.getLastActiveDate();

    // CHECK
    if (lastActive == null) {
        stats.setCurrentStreak(1);
        stats.setLongestStreak(1);
    } else if (lastActive.equals(today.minusDays(1))) {
        // Consecutive day — INCREMENT (based on stale read)
        stats.setCurrentStreak(stats.getCurrentStreak() + 1);
        if (stats.getCurrentStreak() > stats.getLongestStreak()) {
            stats.setLongestStreak(stats.getCurrentStreak());
        }
    } else if (!lastActive.equals(today)) {
        stats.setCurrentStreak(1);
    }
    // If lastActive == today, do nothing

    // WRITE
    stats.setLastActiveDate(today);
    statsRepository.save(stats);
}
```

`updateStreak` is called from both `updateProgress` (line 98) and `bulkUpdateProgress` (line 137). Both callers are `@Transactional` but the transaction isolation defaults to `READ_COMMITTED`. This means:

1. Thread A reads `currentStreak = 5, lastActive = yesterday`
2. Thread B reads `currentStreak = 5, lastActive = yesterday`
3. Thread A computes `currentStreak = 6`, writes `currentStreak = 6, lastActive = today`
4. Thread B computes `currentStreak = 6` (from stale `5`), writes `currentStreak = 6, lastActive = today`
5. **Result: streak should be 7 (two completions on consecutive days), but is 6**

The same issue applies to `lastActiveDate` — if the first write sets `lastActive = today`, the second thread's `lastActive.equals(today.minusDays(1))` check was computed before seeing this update, so it incorrectly treats it as a consecutive day again.

## Impact

1. **Silent streak corruption** — Users' streaks drift downward over time. A user who practices daily sees their streak increment by fewer days than they actually practiced.
2. **No error or warning** — The corruption happens silently with no log output or exception.
3. **Gamification integrity loss** — The streak counter is a core engagement metric. If the numbers are unreliable, user trust erodes.
4. **Affects leaderboard/ranking** — If streaks are used in any ranking or achievement system, the entire feature is compromised.

## Reproducer

1. Authenticate as a user with `currentStreak = 5, lastActive = yesterday`.
2. Simultaneously send two `POST /api/v1/practice/progress` requests (with different `problemId` values).
3. Or send one `POST /api/v1/practice/progress` and one `POST /api/v1/practice/progress/bulk` simultaneously.
4. Expected: `currentStreak = 7`. Actual: `currentStreak = 6`.

## Proposed Fix

### Option A (recommended): Optimistic locking with retry

Add a `@Version` field to `UserPracticeStats` entity and retry on `OptimisticLockException`.

**Step 1: Add version field to `UserPracticeStats.java`:**

```java
@Version
@Column(name = "version")
private Integer version;
```

Add import: `import jakarta.persistence.Version;`

**Step 2: Add retry logic to `PracticeService.java`:**

Wrap the `updateStreak` and its callers with a retry mechanism that catches `ObjectOptimisticLockingFailureException`:

```java
@Transactional
public ProgressResponse updateProgress(UUID userId, ProgressRequest request) {
    // ... existing progress save logic ...
    if ("Completed".equals(request.getStatus())) {
        updateStreakWithRetry(userId);
    }
    return getUserProgress(userId);
}

private void updateStreakWithRetry(UUID userId) {
    final int MAX_RETRIES = 3;
    for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            updateStreak(userId);
            return;
        } catch (ObjectOptimisticLockingFailureException e) {
            if (attempt == MAX_RETRIES) {
                log.error("Failed to update streak for user {} after {} attempts", userId, MAX_RETRIES, e);
                throw e;
            }
            // Retry with fresh data
        }
    }
}
```

**Step 3: Define a column for the `version` field in SQL migration:**

```sql
ALTER TABLE user_practice_stats ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
```

### Option B: Pessimistic locking

Use `@Lock(PESSIMISTIC_WRITE)` on the repository to acquire an exclusive row-level lock before reading:

```java
public interface UserPracticeStatsRepository extends JpaRepository<UserPracticeStats, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<UserPracticeStats> findById(UUID userId);
}
```

**Caveat:** Pessimistic locking reduces throughput under concurrent load and requires the database connection to hold the lock for the duration of the transaction. On PostgreSQL this uses `SELECT ... FOR UPDATE`.

### Option C: De-duplicate within the transaction

Modify `updateStreak` to check if the streak was already incremented today within the same transaction by using a database-side atomic operation. However, this is complex because the streak logic depends on the `lastActiveDate` comparison (yesterday vs today vs older), which cannot be expressed as a simple increment.

## Code Locations

| File | Lines | Description |
|------|-------|-------------|
| `backend/.../service/PracticeService.java` | 143-167 | `updateStreak()` — race-condition-prone read-check-write |
| `backend/.../service/PracticeService.java` | 76-101 | `updateProgress()` — calls `updateStreak` |
| `backend/.../service/PracticeService.java` | 103-141 | `bulkUpdateProgress()` — calls `updateStreak` |
| `backend/.../entity/UserPracticeStats.java` | 18-34 | Entity class — needs `@Version` field |
| `backend/.../repository/UserPracticeStatsRepository.java` | 10 | Repository — may need `@Lock` annotation |

## Estimated Change Size

- Option A: ~25 lines (version field + retry logic + imports)
- Option B: ~4 lines (add `@Lock` annotation) — simpler but higher contention
