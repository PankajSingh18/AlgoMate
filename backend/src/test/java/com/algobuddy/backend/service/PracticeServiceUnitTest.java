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
        // Use a fixed static reference date to avoid midnight boundary flakiness (#3819)
        LocalDate fixedToday = LocalDate.of(2026, 7, 21);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, fixedToday.minusDays(1), 0);

        // When insertStatsIfNotExists is called, do nothing
        doNothing().when(statsRepository).insertStatsIfNotExists(userId);

        // When findAndLockByUserId is called, return our stats object
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        // Execute updateStreak with deterministic client date
        practiceService.updateStreak(userId, fixedToday);

        // Verify that insertStatsIfNotExists was called first
        verify(statsRepository, times(1)).insertStatsIfNotExists(userId);

        // Verify findAndLockByUserId was called
        verify(statsRepository, times(1)).findAndLockByUserId(userId);

        // Verify the record was updated to target date and streak was incremented
        assertEquals(6, stats.getCurrentStreak());
        assertEquals(6, stats.getLongestStreak());
        assertEquals(fixedToday, stats.getLastActiveDate());

        // Verify save was called with the updated stats
        verify(statsRepository, times(1)).save(stats);
    }

    @Test
    public void testConcurrentUpdateStreakSerializationSimulation() throws InterruptedException {
        UUID userId = UUID.randomUUID();
        LocalDate fixedToday = LocalDate.of(2026, 7, 21);
        
        // We will simulate two threads calling updateStreak concurrently.
        // We'll use a ReentrantLock inside a mock Answer to simulate database lock blocking.
        ReentrantLock mockDbLock = new ReentrantLock();
        AtomicInteger activeThreadsInCriticalSection = new AtomicInteger(0);
        AtomicInteger maxConcurrentThreadsInCriticalSection = new AtomicInteger(0);

        // We use a shared UserPracticeStats state with a fixed static reference date
        UserPracticeStats sharedStats = new UserPracticeStats(userId, 5, 5, fixedToday.minusDays(1), 0);

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

            UserPracticeStats currentStatsState = new UserPracticeStats(
                    sharedStats.getUserId(),
                    sharedStats.getCurrentStreak(),
                    sharedStats.getLongestStreak(),
                    sharedStats.getLastActiveDate(),
                    sharedStats.getVisualizedCount()
            );
            return Optional.of(currentStatsState);
        });

        // We mock statsRepository.save to update the shared state and release the lock safely inside try-finally
        when(statsRepository.save(any(UserPracticeStats.class))).thenAnswer(invocation -> {
            try {
                UserPracticeStats savedStats = invocation.getArgument(0);
                
                // Update the shared stats (representing database commit/flush)
                sharedStats.setCurrentStreak(savedStats.getCurrentStreak());
                sharedStats.setLongestStreak(savedStats.getLongestStreak());
                sharedStats.setLastActiveDate(savedStats.getLastActiveDate());
                sharedStats.setVisualizedCount(savedStats.getVisualizedCount());

                return sharedStats;
            } finally {
                // Safely decrement active threads and release lock
                if (mockDbLock.isHeldByCurrentThread()) {
                    activeThreadsInCriticalSection.decrementAndGet();
                    mockDbLock.unlock();
                }
            }
        });

        // Run 2 threads concurrently
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(2);

        Runnable task = () -> {
            try {
                practiceService.updateStreak(userId, fixedToday);
            } finally {
                // Safety net: ensure any held mock DB lock is released even if updateStreak throws an exception before save()
                if (mockDbLock.isHeldByCurrentThread()) {
                    activeThreadsInCriticalSection.decrementAndGet();
                    mockDbLock.unlock();
                }
                latch.countDown();
            }
        };

        executor.submit(task);
        executor.submit(task);

        latch.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, maxConcurrentThreadsInCriticalSection.get(), "Pessimistic lock simulation failed to serialize transactions");
        assertEquals(6, sharedStats.getCurrentStreak(), "Final streak should be 6");
        assertEquals(fixedToday, sharedStats.getLastActiveDate(), "Last active date should be target date");
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
}