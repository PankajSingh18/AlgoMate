package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArenaMatchResponse {
    private UUID id;
    private String opponentName; // We might just use "Opponent {uuid}" for now since we don't have a joined users table
    private String topic;
    private String difficulty;
    private LocalDateTime startTime;
    private String result; // "Victory", "Defeat", "Draw", "In Progress"
    private Integer ratingChange; // The change specific to the requesting user
    private Integer xpAwarded; // The XP awarded to the requesting user
}
