package com.algobuddy.backend.repository;

import com.algobuddy.backend.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    Page<Bookmark> findByUserId(UUID userId, Pageable pageable);
    List<Bookmark> findByUserId(UUID userId); // Keep list method for compatibility if needed elsewhere
    Optional<Bookmark> findByUserIdAndProblemId(UUID userId, String problemId);
}
