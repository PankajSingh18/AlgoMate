package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.BulkProgressRequest;
import com.algobuddy.backend.dto.ProgressRequest;
import com.algobuddy.backend.dto.ProgressResponse;
import com.algobuddy.backend.service.PracticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
@RestController
@RequestMapping("/api/v1/practice")
@RequiredArgsConstructor
@Tag(name = "Practice", description = "Endpoints for user practice progress and statistics")
public class PracticeController {

    private final PracticeService practiceService;

    @GetMapping("/progress")
    @Operation(summary = "Get user progress", description = "Retrieves the practice progress and statistics for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved progress")
    public ResponseEntity<ProgressResponse> getProgress(@CurrentUserId @NonNull UUID userId) {
        return ResponseEntity.ok(practiceService.getUserProgress(userId));
    }

    @PostMapping("/progress")
    @Operation(summary = "Update progress", description = "Updates the progress status of a single practice problem.")
    @ApiResponse(responseCode = "200", description = "Successfully updated progress")
    @ApiResponse(responseCode = "400", description = "Invalid request payload")
    public ResponseEntity<ProgressResponse> updateProgress(@CurrentUserId @NonNull UUID userId, 
                                                           @Valid @RequestBody ProgressRequest request) {
        ProgressResponse response = practiceService.updateProgress(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/progress/bulk")
    @Operation(summary = "Bulk update progress", description = "Updates the progress status of multiple practice problems at once.")
    @ApiResponse(responseCode = "200", description = "Successfully updated bulk progress")
    @ApiResponse(responseCode = "400", description = "Invalid request payload")
    public ResponseEntity<ProgressResponse> bulkUpdateProgress(@CurrentUserId @NonNull UUID userId,
                                                               @Valid @RequestBody BulkProgressRequest request) {
        ProgressResponse response = practiceService.bulkUpdateProgress(userId, request);
        return ResponseEntity.ok(response);
    }
}
