package com.algobuddy.backend.controller;

import com.algobuddy.backend.dto.LeaderboardEntryDto;
import com.algobuddy.backend.service.LeaderboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Endpoints for fetching global leaderboards")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/global/streak")
    @Operation(summary = "Global streak leaderboard", description = "Top users by streak")
    public ResponseEntity<List<LeaderboardEntryDto>> getGlobalStreak() {
        return ResponseEntity.ok(leaderboardService.getGlobalStreakLeaderboard());
    }

    @GetMapping("/global/arena")
    @Operation(summary = "Global arena leaderboard", description = "Top users by ELO rating")
    public ResponseEntity<List<LeaderboardEntryDto>> getGlobalArena() {
        return ResponseEntity.ok(leaderboardService.getGlobalArenaLeaderboard());
    }
}
