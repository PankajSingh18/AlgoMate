package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkRequestDto {
    @NotBlank(message = "problemId is required")
    private String problemId;
    @NotBlank(message = "topicSlug is required")
    private String topicSlug;
}
