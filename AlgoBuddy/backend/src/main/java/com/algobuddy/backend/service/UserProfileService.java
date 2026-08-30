package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.UserProfileDto;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfile upsertProfile(UUID userId, UserProfileDto dto) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(UserProfile.builder().userId(userId).build());

        profile.setUsername(dto.getUsername());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setUpdatedAt(OffsetDateTime.now());

        return userProfileRepository.save(profile);
    }
    
    public UserProfile getProfile(UUID userId) {
        return userProfileRepository.findById(userId).orElse(null);
    }
}
