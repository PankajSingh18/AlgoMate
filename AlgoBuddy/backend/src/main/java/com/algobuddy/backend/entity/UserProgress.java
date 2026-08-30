package com.algobuddy.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_progress", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "problem_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id = UUID.randomUUID();

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "problem_id", nullable = false)
    private String problemId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
