package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PracticeServiceUnitTest {

    private UserProgressRepository progressRepository;
    private UserPracticeStatsRepository statsRepository;
    private PracticeService practiceService;

    @BeforeEach
    public void setUp() {
        progressRepository = mock(UserProgressRepository.class);
        statsRepository = mock(UserPracticeStatsRepository.class);
        practiceService = new PracticeService(progressRepository, statsRepository);
    }

    @Test
    public void testUpdateStreakSequentialAndLockingFlow() {
        UUID userId = UUID.randomUUID();
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, LocalDate.now().minusDays(1), 0);

        // When insertStatsIfNotExists is called, do nothing
        doNothing().when(statsRepository).insertStatsIfNotExists(userId);

        // When findAndLockByUserId is called, return our stats object
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        // Execute updateStreak
        practiceService.updateStreak(userId);

        // Verify that insertStatsIfNotExists was called first
        verify(statsRepository, times(1)).insertStatsIfNotExists(userId);

        // Verify findAndLockByUserId was called
        verify(statsRepository, times(1)).findAndLockByUserId(userId);

        // Verify the record was updated to today and streak was incremented
        assertEquals(6, stats.getCurrentStreak());
        assertEquals(6, stats.getLongestStreak());
        assertEquals(LocalDate.now(), stats.getLastActiveDate());

        // Verify save was called with the updated stats
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testConcurrentUpdateStreakSerializationSimulation() throws InterruptedException {
        UUID userId = UUID.randomUUID();
        
        // We will simulate two threads calling updateStreak concurrently.
        // We'll use a ReentrantLock inside a mock Answer to simulate database lock blocking.
        ReentrantLock mockDbLock = new ReentrantLock();
        AtomicInteger activeThreadsInCriticalSection = new AtomicInteger(0);
        AtomicInteger maxConcurrentThreadsInCriticalSection = new AtomicInteger(0);

        // We use a shared UserPracticeStats state
        UserPracticeStats sharedStats = new UserPracticeStats(userId, 5, 5, LocalDate.now().minusDays(1), 0);

        doAnswer(invocation -> {
            // Simulate database ON CONFLICT DO NOTHING
            return null;
        }).when(statsRepository).insertStatsIfNotExists(userId);

        when(statsRepository.findAndLockByUserId(userId)).thenAnswer(invocation -> {
            // Acquire the lock to simulate SELECT FOR UPDATE
            mockDbLock.lock();
            
            // Track how many threads are concurrently holding this mock database lock
            int active = activeThreadsInCriticalSection.incrementAndGet();
            if (active > maxConcurrentThreadsInCriticalSection.get()) {
                maxConcurrentThreadsInCriticalSection.set(active);
            }

            // Return a copy or the actual object. In hibernate, since it is a database transaction,
            // each transaction gets the database state at the time of SELECT FOR UPDATE.
            UserPracticeStats currentStatsState = new UserPracticeStats(
                    sharedStats.getUserId(),
                    sharedStats.getCurrentStreak(),
                    sharedStats.getLongestStreak(),
                    sharedStats.getLastActiveDate(),
                    sharedStats.getVisualizedCount()
            );
            return Optional.of(currentStatsState);
        });

        // We mock statsRepository.save to update the shared state and release the lock
        when(statsRepository.save(any(UserPracticeStats.class))).thenAnswer(invocation -> {
            UserPracticeStats savedStats = invocation.getArgument(0);
            
            // Update the shared stats (representing database commit/flush)
            sharedStats.setCurrentStreak(savedStats.getCurrentStreak());
            sharedStats.setLongestStreak(savedStats.getLongestStreak());
            sharedStats.setLastActiveDate(savedStats.getLastActiveDate());
            sharedStats.setVisualizedCount(savedStats.getVisualizedCount());

            // Decrement active threads holding lock
            activeThreadsInCriticalSection.decrementAndGet();
            
            // Release the lock to simulate transaction commit/end releasing the row lock
            mockDbLock.unlock();
            return sharedStats;
        });

        // Run 2 threads concurrently
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(2);

        Runnable task = () -> {
            try {
                practiceService.updateStreak(userId);
            } finally {
                latch.countDown();
            }
        };

        executor.submit(task);
        executor.submit(task);

        latch.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        // Under pessimistic locking simulation:
        // 1. Thread A acquires mockDbLock, activeThreadsInCriticalSection = 1, reads sharedStats (streak = 5, lastActive = yesterday).
        // 2. Thread B attempts to call findAndLockByUserId, blocks on mockDbLock.lock().
        // 3. Thread A updates currentStreak = 6, lastActiveDate = today, calls save().
        // 4. In save(), sharedStats is updated, activeThreadsInCriticalSection = 0, and mockDbLock.unlock() is called.
        // 5. Thread B resumes, acquires mockDbLock, activeThreadsInCriticalSection = 1, reads sharedStats (now streak = 6, lastActive = today).
        // 6. Thread B sees lastActive == today, does nothing (streak remains 6, lastActive = today), calls save().
        // 7. Thread B releases lock.
        // Thus, maximum concurrent threads in the critical section should be exactly 1, and the final streak should be 6.
        
        assertEquals(1, maxConcurrentThreadsInCriticalSection.get(), "Pessimistic lock simulation failed to serialize transactions");
        assertEquals(6, sharedStats.getCurrentStreak(), "Final streak should be 6");
        assertEquals(LocalDate.now(), sharedStats.getLastActiveDate(), "Last active date should be today");
    }

    @Test
    public void testUpdateStreakWithClientLocalDateConsecutive() {
        UUID userId = UUID.randomUUID();
        LocalDate clientToday = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, clientToday.minusDays(1), 0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientToday);

        assertEquals(6, stats.getCurrentStreak());
        assertEquals(6, stats.getLongestStreak());
        assertEquals(clientToday, stats.getLastActiveDate());
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testUpdateStreakWithClientLocalDateOutOfOrder() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 9);
        // User solved today, but an out of order completion arrives for yesterday
        LocalDate clientYesterday = lastActive.minusDays(1);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, lastActive, 0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientYesterday);

        // Streak and last active date should not be changed/reset
        assertEquals(5, stats.getCurrentStreak());
        assertEquals(5, stats.getLongestStreak());
        assertEquals(lastActive, stats.getLastActiveDate());
        verify(statsRepository, never()).save(any(UserPracticeStats.class));
    }

    @Test
    public void testUpdateStreakWithClientLocalDateFutureBreak() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 5);
        // User starts practicing again on July 9th (gap of 4 days)
        LocalDate clientFuture = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, lastActive, 0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientFuture);

        // Streak should be broken and reset to 1
        assertEquals(1, stats.getCurrentStreak());
        assertEquals(5, stats.getLongestStreak());
        assertEquals(clientFuture, stats.getLastActiveDate());
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testUpdateStreakGapWithFreezeAvailable_consumesFreezeAndPreservesStreak() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 5);
        // Gap of 4 days, but user has 2 streak freezes available
        LocalDate clientFuture = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 10, 12, lastActive, 0);
        stats.setStreakFreezeCount(2);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientFuture);

        // currentStreak must be preserved, not reset
        assertEquals(10, stats.getCurrentStreak());
        // longestStreak untouched since currentStreak didn't grow
        assertEquals(12, stats.getLongestStreak());
        // exactly 1 freeze consumed
        assertEquals(1, stats.getStreakFreezeCount());
        // lastActiveDate patched to the day before clientFuture
        assertEquals(clientFuture.minusDays(1), stats.getLastActiveDate());
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testUpdateStreakGapWithNoFreezeAvailable_resetsToOne() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 5);
        LocalDate clientFuture = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 10, 12, lastActive, 0);
        stats.setStreakFreezeCount(0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientFuture);

        // No freeze available -> existing reset behavior applies
        assertEquals(1, stats.getCurrentStreak());
        assertEquals(12, stats.getLongestStreak());
        assertEquals(0, stats.getStreakFreezeCount());
        assertEquals(clientFuture, stats.getLastActiveDate());
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testUpdateStreakFreezeConsumption_thenNextDayContinuesConsecutively() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 5);
        LocalDate missedCheckIn = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 10, 12, lastActive, 0);
        stats.setStreakFreezeCount(1);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        // First call: gap covered by freeze
        practiceService.updateStreak(userId, missedCheckIn);
        assertEquals(10, stats.getCurrentStreak());
        assertEquals(0, stats.getStreakFreezeCount());
        assertEquals(missedCheckIn.minusDays(1), stats.getLastActiveDate());

        // Second call: next day, should now be treated as consecutive and increment
        LocalDate nextDay = missedCheckIn;
        practiceService.updateStreak(userId, nextDay);
        assertEquals(11, stats.getCurrentStreak());
        assertEquals(12, stats.getLongestStreak());
        assertEquals(nextDay, stats.getLastActiveDate());
    }
}