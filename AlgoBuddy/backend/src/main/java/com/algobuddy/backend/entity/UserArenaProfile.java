package com.algobuddy.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "user_arena_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserArenaProfile {

    @Id
    @Column(name = "user_id", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID userId;

    @Column(name = "xp", nullable = false)
    @Builder.Default
    private Integer xp = 0;

    @Column(name = "level", nullable = false)
    @Builder.Default
    private Integer level = 1;

    @Column(name = "rating", nullable = false)
    @Builder.Default
    private Integer rating = 1200;

    @Column(name = "battles_won", nullable = false)
    @Builder.Default
    private Integer battlesWon = 0;

    @Column(name = "battles_lost", nullable = false)
    @Builder.Default
    private Integer battlesLost = 0;

    @Column(name = "total_problems_solved", nullable = false)
    @Builder.Default
    private Integer totalProblemsSolved = 0;

    @Version
    @Column(name = "version")
    private Integer version;

    public void addXp(int amount) {
        this.xp += amount;
        updateLevel();
    }

    private void updateLevel() {
        // Simple level logic: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP, etc.
        // For now, level = (xp / 1000) + 1
        this.level = (this.xp / 1000) + 1;
    }
}
