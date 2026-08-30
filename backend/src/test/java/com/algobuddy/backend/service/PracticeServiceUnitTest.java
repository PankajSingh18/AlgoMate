package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

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

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        // Execute updateStreak
        practiceService.updateStreak(userId);

        verify(statsRepository, times(1)).insertStatsIfNotExists(userId);
        verify(statsRepository, times(1)).findAndLockByUserId(userId);

        // Capture saved entity instead of asserting pointer identity
        ArgumentCaptor<UserPracticeStats> captor = ArgumentCaptor.forClass(UserPracticeStats.class);
        verify(statsRepository, times(1)).save(captor.capture());

        UserPracticeStats savedStats = captor.getValue();
        assertEquals(6, savedStats.getCurrentStreak());
        assertEquals(6, savedStats.getLongestStreak());
        assertEquals(LocalDate.now(), savedStats.getLastActiveDate());
    }

    @Test
    public void testConcurrentUpdateStreakSerializationSimulation() throws InterruptedException {
        UUID userId = UUID.randomUUID();
        
        ReentrantLock mockDbLock = new ReentrantLock();
        AtomicInteger activeThreadsInCriticalSection = new AtomicInteger(0);
        AtomicInteger maxConcurrentThreadsInCriticalSection = new AtomicInteger(0);

        UserPracticeStats sharedStats = new UserPracticeStats(userId, 5, 5, LocalDate.now().minusDays(1), 0);

        doAnswer(invocation -> null).when(statsRepository).insertStatsIfNotExists(userId);

        when(statsRepository.findAndLockByUserId(userId)).thenAnswer(invocation -> {
            mockDbLock.lock();
            
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

        when(statsRepository.save(any(UserPracticeStats.class))).thenAnswer(invocation -> {
            UserPracticeStats savedStats = invocation.getArgument(0);
            
            sharedStats.setCurrentStreak(savedStats.getCurrentStreak());
            sharedStats.setLongestStreak(savedStats.getLongestStreak());
            sharedStats.setLastActiveDate(savedStats.getLastActiveDate());
            sharedStats.setVisualizedCount(savedStats.getVisualizedCount());

            activeThreadsInCriticalSection.decrementAndGet();
            mockDbLock.unlock();
            return sharedStats;
        });

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

        ArgumentCaptor<UserPracticeStats> captor = ArgumentCaptor.forClass(UserPracticeStats.class);
        verify(statsRepository, times(1)).save(captor.capture());

        UserPracticeStats savedStats = captor.getValue();
        assertEquals(6, savedStats.getCurrentStreak());
        assertEquals(6, savedStats.getLongestStreak());
        assertEquals(clientToday, savedStats.getLastActiveDate());
    }

    @Test
    public void testUpdateStreakWithClientLocalDateOutOfOrder() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 9);
        LocalDate clientYesterday = lastActive.minusDays(1);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, lastActive, 0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientYesterday);

        // Verify save was never invoked for out-of-order calls
        verify(statsRepository, never()).save(any(UserPracticeStats.class));
    }

    @Test
    public void testUpdateStreakWithClientLocalDateFutureBreak() {
        UUID userId = UUID.randomUUID();
        LocalDate lastActive = LocalDate.of(2026, 7, 5);
        LocalDate clientFuture = LocalDate.of(2026, 7, 9);
        UserPracticeStats stats = new UserPracticeStats(userId, 5, 5, lastActive, 0);

        doNothing().when(statsRepository).insertStatsIfNotExists(userId);
        when(statsRepository.findAndLockByUserId(userId)).thenReturn(Optional.of(stats));

        practiceService.updateStreak(userId, clientFuture);

        ArgumentCaptor<UserPracticeStats> captor = ArgumentCaptor.forClass(UserPracticeStats.class);
        verify(statsRepository, times(1)).save(captor.capture());

        UserPracticeStats savedStats = captor.getValue();
        assertEquals(1, savedStats.getCurrentStreak());
        assertEquals(5, savedStats.getLongestStreak());
        assertEquals(clientFuture, savedStats.getLastActiveDate());
    }
}