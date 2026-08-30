package com.algobuddy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserProfileDto {
    @NotBlank
    private String username;
    private String avatarUrl;
}
