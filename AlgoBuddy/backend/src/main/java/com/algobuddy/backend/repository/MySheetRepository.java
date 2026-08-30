package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.MySheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MySheetRepository extends JpaRepository<MySheet, UUID> {
    Page<MySheet> findByUserId(UUID userId, Pageable pageable);
    List<MySheet> findByUserId(UUID userId);
    Optional<MySheet> findByUserIdAndProblemId(UUID userId, String problemId);
    List<MySheet> findByUserIdAndIsPublicTrue(UUID userId);
    List<MySheet> findByUserIdAndIsPublicTrueAndSharedNotesTrue(UUID userId);
    List<MySheet> findByUserIdAndProblemIdIn(UUID userId, List<String> problemIds);
}
