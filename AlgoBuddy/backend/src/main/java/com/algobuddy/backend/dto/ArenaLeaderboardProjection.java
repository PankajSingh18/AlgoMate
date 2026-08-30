package com.algobuddy.backend.dto;

import java.util.UUID;

public interface ArenaLeaderboardProjection {
    UUID getUserId();
    Integer getXp();
    Integer getLevel();
    Integer getRating();
    Integer getBattlesWon();
    Integer getBattlesLost();
    Integer getTotalProblemsSolved();
    String getName();
    String getAvatarUrl();
}
