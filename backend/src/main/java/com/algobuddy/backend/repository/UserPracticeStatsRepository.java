package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserPracticeStats;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPracticeStatsRepository extends JpaRepository<UserPracticeStats, UUID> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO user_practice_stats (user_id, current_streak, longest_streak, last_active_date, visualized_count, streak_freeze_count)
        VALUES (:userId, 0, 0, NULL, 0, 0)
        ON CONFLICT (user_id) DO NOTHING
        """, nativeQuery = true)
    void insertStatsIfNotExists(@Param("userId") UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from UserPracticeStats s where s.userId = :userId")
    Optional<UserPracticeStats> findAndLockByUserId(@Param("userId") UUID userId);

    List<UserPracticeStats> findTop100ByOrderByCurrentStreakDesc();

    @org.springframework.data.jpa.repository.Query("""
        SELECT new com.algobuddy.backend.dto.LeaderboardEntryDto(
            0, s.userId, COALESCE(p.username, 'Anonymous'), p.avatarUrl, s.currentStreak
        )
        FROM UserPracticeStats s
        LEFT JOIN UserProfile p ON s.userId = p.userId
        ORDER BY s.currentStreak DESC
        """)
    List<com.algobuddy.backend.dto.LeaderboardEntryDto> findTop100StreakLeaderboard(org.springframework.data.domain.Pageable pageable);
}
