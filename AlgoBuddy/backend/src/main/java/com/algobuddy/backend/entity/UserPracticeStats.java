package com.algobuddy.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Version;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "user_practice_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPracticeStats {

    @Id
    @Column(name = "user_id", columnDefinition = "uuid")
    private UUID userId;

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "longest_streak")
    private Integer longestStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "visualized_count")
    private Integer visualizedCount = 0;

    @Version
    @Column(name = "version")
    private Integer version = 0;

    public UserPracticeStats(UUID userId, Integer currentStreak, Integer longestStreak, LocalDate lastActiveDate, Integer visualizedCount) {
        this.userId = userId;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.lastActiveDate = lastActiveDate;
        this.visualizedCount = visualizedCount;
        this.version = 0;
    }
}
