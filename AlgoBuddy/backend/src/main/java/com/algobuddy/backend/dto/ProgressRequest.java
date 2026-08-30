package com.algobuddy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ProgressRequest {
    @NotBlank(message = "problemId is required")
    private String problemId;
    @NotBlank(message = "status is required")
    @Pattern(regexp = "^(Completed|In Progress|Attempted|Bookmarked)$",
             message = "Invalid status. Must be one of: Completed, In Progress, Attempted, Bookmarked")
    private String status;
}
