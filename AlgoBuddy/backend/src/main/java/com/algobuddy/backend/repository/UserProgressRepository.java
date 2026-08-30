package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUserId(UUID userId);
    Optional<UserProgress> findByUserIdAndProblemId(UUID userId, String problemId);

    List<UserProgress> findByUserIdAndProblemIdIn(UUID userId, List<String> problemIds);

    @Query(value = "SELECT COUNT(*) FROM user_progress WHERE user_id = :userId AND status = 'Completed' AND updated_at >= :startTime", nativeQuery = true)
    int countCompletedSince(@Param("userId") UUID userId, @Param("startTime") OffsetDateTime startTime);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO user_progress (id, user_id, problem_id, status, updated_at)
        VALUES (gen_random_uuid(), :userId, :problemId, :status, NOW())
        ON CONFLICT (user_id, problem_id)
        DO UPDATE SET status = :status, updated_at = NOW()
        """, nativeQuery = true)
    void upsertProgress(@Param("userId") UUID userId,
                        @Param("problemId") String problemId,
                        @Param("status") String status);
}
