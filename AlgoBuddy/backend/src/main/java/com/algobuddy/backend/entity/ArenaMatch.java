package com.algobuddy.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "arena_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArenaMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "match_id", unique = true)
    private String matchId;

    @Column(name = "player1_id", nullable = false)
    private UUID player1Id;

    @Column(name = "player2_id", nullable = false)
    private UUID player2Id;

    @Column(name = "winner_id")
    private UUID winnerId; // Null if it was a draw or hasn't finished

    @Column(name = "topic")
    private String topic;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "rating_change_p1")
    private Integer ratingChangeP1;

    @Column(name = "rating_change_p2")
    private Integer ratingChangeP2;

    @Column(name = "xp_awarded_p1")
    private Integer xpAwardedP1;

    @Column(name = "xp_awarded_p2")
    private Integer xpAwardedP2;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MatchStatus status = MatchStatus.PENDING;

    @Version
    @Column(name = "version")
    private Integer version;

    public enum MatchStatus {
        PENDING,
        ACTIVE,
        COMPLETED,
        EXPIRED
    }
}
