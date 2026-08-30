package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.UserProfileDto;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/profile")
@RequiredArgsConstructor
@Tag(name = "UserProfile", description = "Endpoints for managing user profile cache")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    @Operation(summary = "Upsert user profile", description = "Updates or creates the cached user profile with username and avatar")
    public ResponseEntity<UserProfile> upsertProfile(@CurrentUserId UUID userId, @Valid @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userProfileService.upsertProfile(userId, dto));
    }
    
    @GetMapping
    @Operation(summary = "Get user profile")
    public ResponseEntity<UserProfile> getProfile(@CurrentUserId UUID userId) {
        UserProfile profile = userProfileService.getProfile(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }
}
