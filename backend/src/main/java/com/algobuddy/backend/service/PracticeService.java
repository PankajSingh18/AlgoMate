package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProgress;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticeService {

    private final UserProgressRepository progressRepository;
    private final UserPracticeStatsRepository statsRepository;

    @Autowired
    private ApplicationContext applicationContext;

    @Transactional(readOnly = true)
    public ProgressResponse getUserProgress(@NonNull UUID userId) {
        List<UserProgress> progressList = progressRepository.findByUserId(userId);
        
        Map<String, ProgressResponse.ProgressDetail> progressMap = progressList.stream()
                .collect(Collectors.toMap(
                        UserProgress::getProblemId, 
                        up -> new ProgressResponse.ProgressDetail(up.getStatus(), up.getUpdatedAt())
                ));

        UserPracticeStats stats = statsRepository.findById(userId)
                .orElse(new UserPracticeStats(userId, 0, 0, null, 0));

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime startOfDay = now.toLocalDate().atStartOfDay(now.getOffset()).toOffsetDateTime();
        OffsetDateTime startOfWeek = now.toLocalDate().with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay(now.getOffset()).toOffsetDateTime();
        OffsetDateTime startOfMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay(now.getOffset()).toOffsetDateTime();

        int dailySolved = progressRepository.countCompletedSince(userId, startOfDay);
        int weeklySolved = progressRepository.countCompletedSince(userId, startOfWeek);
        int monthlySolved = progressRepository.countCompletedSince(userId, startOfMonth);

        return ProgressResponse.builder()
                .progress(progressMap)
                .currentStreak(stats.getCurrentStreak())
                .longestStreak(stats.getLongestStreak())
                .visualizedCount(stats.getVisualizedCount())
                .dailySolved(dailySolved)
                .weeklySolved(weeklySolved)
                .monthlySolved(monthlySolved)
                .build();
    }

    @Transactional
    public ProgressResponse updateProgress(@NonNull UUID userId, ProgressRequest request) {
        progressRepository.upsertProgress(userId, request.getProblemId(), request.getStatus());

        if ("Completed".equals(request.getStatus())) {
            LocalDate clientLocalDate = null;
            if (request.getLocalDate() != null) {
                try {
                    LocalDate parsed = LocalDate.parse(request.getLocalDate());
                    LocalDate today = LocalDate.now();
                    LocalDate yesterday = today.minusDays(1);
                    if (!parsed.isBefore(yesterday) && !parsed.isAfter(today)) {
                        clientLocalDate = parsed;
                    }
                } catch (Exception e) {
                    // Ignore parse errors, fallback to default behavior
                }
            }
            updateStreakWithRetry(userId, clientLocalDate);
        }

        return getUserProgress(userId);
    }

    @Transactional
    public ProgressResponse bulkUpdateProgress(@NonNull UUID userId, BulkProgressRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return getUserProgress(userId);
        }

        List<BulkProgressRequest.Item> validItems = request.getItems().stream()
                .filter(item -> item.getProblemId() != null && !item.getProblemId().trim().isEmpty() && item.getStatus() != null)
                .toList();

        if (validItems.isEmpty()) {
            return getUserProgress(userId);
        }

        List<String> problemIds = validItems.stream().map(BulkProgressRequest.Item::getProblemId).toList();
        List<UserProgress> existingProgress = progressRepository.findByUserIdAndProblemIdIn(userId, problemIds);

        Map<String, UserProgress> existingProgressMap = existingProgress.stream()
                .collect(Collectors.toMap(UserProgress::getProblemId, p -> p));

        List<UserProgress> toSave = new java.util.ArrayList<>();
        boolean anyCompleted = false;

        for (BulkProgressRequest.Item item : validItems) {
            UserProgress progress = existingProgressMap.get(item.getProblemId());
            if (progress != null) {
                progress.setStatus(item.getStatus());
                progress.setUpdatedAt(OffsetDateTime.now());
            } else {
                progress = new UserProgress();
                progress.setUserId(userId);
                progress.setProblemId(item.getProblemId());
                progress.setStatus(item.getStatus());
                progress.setUpdatedAt(OffsetDateTime.now());
            }
            toSave.add(progress);

            if ("Completed".equals(item.getStatus())) {
                anyCompleted = true;
            }
        }

        progressRepository.saveAll(toSave);

        if (anyCompleted) {
            LocalDate clientLocalDate = null;
            if (request.getLocalDate() != null) {
                try {
                    LocalDate parsed = LocalDate.parse(request.getLocalDate());
                    LocalDate today = LocalDate.now();
                    LocalDate yesterday = today.minusDays(1);
                    if (!parsed.isBefore(yesterday) && !parsed.isAfter(today)) {
                        clientLocalDate = parsed;
                    }
                } catch (Exception e) {
                    // Ignore parse errors, fallback to default behavior
                }
            }
            updateStreakWithRetry(userId, clientLocalDate);
        }

        return getUserProgress(userId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStreak(@NonNull UUID userId) {
        updateStreak(userId, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStreak(@NonNull UUID userId, LocalDate clientLocalDate) {
        statsRepository.insertStatsIfNotExists(userId);

        UserPracticeStats stats = statsRepository.findAndLockByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("UserPracticeStats should exist for user: " + userId));

        LocalDate today = clientLocalDate != null ? clientLocalDate : LocalDate.now();
        LocalDate lastActive = stats.getLastActiveDate();
        int targetGoal = stats.getDailyTargetGoal() != null ? stats.getDailyTargetGoal() : 1;

        // Ignore out of order / past updates
        if (lastActive != null && today.isBefore(lastActive)) {
            return;
        }

        if (lastActive == null) {
            // First time setup
            stats.setLastActiveDate(today);
            stats.setDailyProgressCount(1);
            if (1 >= targetGoal) {
                stats.setCurrentStreak(1);
                stats.setLongestStreak(Math.max(1, stats.getLongestStreak()));
            }
        } else if (lastActive.equals(today)) {
            // Same day activity: increment progress
            int newProgress = (stats.getDailyProgressCount() != null ? stats.getDailyProgressCount() : 0) + 1;
            stats.setDailyProgressCount(newProgress);

            // Grace Period Recovery check (2x target goal required)
            if (Boolean.TRUE.equals(stats.getInGracePeriod()) && newProgress >= targetGoal * 2) {
                stats.setInGracePeriod(false);
                stats.setCurrentStreak(stats.getCurrentStreak() + 2); // Recover missed day + today
                if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                    stats.setLongestStreak(stats.getCurrentStreak());
                }
            } 
            // Standard target goal threshold reached for today
            else if (!Boolean.TRUE.equals(stats.getInGracePeriod()) && newProgress == targetGoal) {
                stats.setCurrentStreak(stats.getCurrentStreak() + 1);
                if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                    stats.setLongestStreak(stats.getCurrentStreak());
                }
            }
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastActive, today);

            if (daysBetween == 1) {
                // Consecutive day activity
                stats.setLastActiveDate(today);
                stats.setDailyProgressCount(1);

                if (1 >= targetGoal) {
                    stats.setCurrentStreak(stats.getCurrentStreak() + 1);
                    if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                        stats.setLongestStreak(stats.getCurrentStreak());
                    }
                }
            } else if (daysBetween == 2 && !Boolean.TRUE.equals(stats.getInGracePeriod())) {
                // Missed exactly 1 day -> enter Grace Period
                stats.setInGracePeriod(true);
                stats.setLastActiveDate(today);
                stats.setDailyProgressCount(1);

                // Immediate recovery check if targetGoal == 1/2 and 1 progress hits 2x target
                if (1 >= targetGoal * 2) {
                    stats.setInGracePeriod(false);
                    stats.setCurrentStreak(stats.getCurrentStreak() + 2);
                    if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                        stats.setLongestStreak(stats.getCurrentStreak());
                    }
                }
            } else {
                // Gap > 2 days or grace period expired -> reset streak
                stats.setInGracePeriod(false);
                stats.setLastActiveDate(today);
                stats.setDailyProgressCount(1);
                stats.setCurrentStreak(1 >= targetGoal ? 1 : 0);
            }
        }

        statsRepository.save(stats);
    }

    public void updateStreakWithRetry(@NonNull UUID userId) {
        updateStreakWithRetry(userId, null);
    }

    public void updateStreakWithRetry(@NonNull UUID userId, LocalDate clientLocalDate) {
        int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                PracticeService selfProxy = null;
                if (applicationContext != null) {
                    try {
                        selfProxy = applicationContext.getBean(PracticeService.class);
                    } catch (Exception e) {
                        // Fallback if bean not ready
                    }
                }
                if (selfProxy != null) {
                    selfProxy.updateStreak(userId, clientLocalDate);
                } else {
                    updateStreak(userId, clientLocalDate);
                }
                return;
            } catch (org.springframework.dao.TransientDataAccessException e) {
                if (attempt == maxAttempts) {
                    throw e;
                }
                try {
                    Thread.sleep(50 * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(ie);
                }
            }
        }
    }
}