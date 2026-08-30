package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.dto.InitMatchRequest;
import com.algobuddy.backend.service.ArenaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/arena")
@RequiredArgsConstructor
@Tag(name = "Arena", description = "Endpoints for multiplayer coding arena, matchmaking, and leaderboards")
public class ArenaController {

    private final ArenaService arenaService;

    @GetMapping("/profile")
    @Operation(summary = "Get user arena profile", description = "Retrieves the arena statistics and rating for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved profile")
    public ResponseEntity<ArenaProfileResponse> getProfile(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(arenaService.getProfile(userId));
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Get arena leaderboard", description = "Retrieves the top ranked users in the arena.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved leaderboard")
    public ResponseEntity<List<ArenaProfileResponse>> getLeaderboard() {
        return ResponseEntity.ok(arenaService.getLeaderboard());
    }

    @GetMapping("/history")
    @Operation(summary = "Get match history", description = "Retrieves the past arena matches for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved match history")
    public ResponseEntity<List<com.algobuddy.backend.dto.ArenaMatchResponse>> getMatchHistory(@CurrentUserId UUID userId) {
        return ResponseEntity.ok(arenaService.getMatchHistory(userId));
    }

    @GetMapping("/daily-challenge")
    @Operation(summary = "Get daily challenge", description = "Retrieves the daily coding challenge for the arena.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved daily challenge")
    public ResponseEntity<com.algobuddy.backend.dto.DailyChallengeResponse> getDailyChallenge() {
        return ResponseEntity.ok(arenaService.getDailyChallenge());
    }

    @PostMapping("/match/init")
    @Operation(summary = "Initialize match", description = "Creates a match record before the duel begins. Must be called when both players are matched.")
    @ApiResponse(responseCode = "200", description = "Match initialized successfully")
    public ResponseEntity<String> initMatch(@CurrentUserId UUID userId, @RequestBody InitMatchRequest request) {
        arenaService.initMatch(userId, request);
        return ResponseEntity.ok("Match initialized successfully");
    }

    @PostMapping("/match-result")
    @Operation(summary = "Record match result", description = "Records the outcome of an arena match.")
    @ApiResponse(responseCode = "200", description = "Match result recorded successfully")
    public ResponseEntity<String> recordMatchResult(@CurrentUserId UUID userId, @RequestBody com.algobuddy.backend.dto.RecordMatchRequest request) {
        arenaService.recordMatchResult(userId, request);
        return ResponseEntity.ok("Match result recorded successfully");
    }
}
