package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArenaProfileResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID userId;
    private Integer xp;
    private Integer level;
    private Integer rating;
    private Integer battlesWon;
    private Integer battlesLost;
    private Integer totalProblemsSolved;
    private Integer rank; // Calculated rank compared to others
    private String name;
    private String avatarUrl;
}

