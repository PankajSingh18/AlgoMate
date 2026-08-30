package com.algobuddy.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
public class BulkProgressRequest {

    @Valid
    @NotEmpty(message = "items cannot be empty")
    @Size(max = 100, message = "Bulk update limited to 100 items per request")
    private List<Item> items;

    @Data
    public static class Item {
        @NotBlank(message = "problemId is required")
        private String problemId;
        
        @NotBlank(message = "status is required")
        @Pattern(regexp = "^(Completed|In Progress|Attempted|Bookmarked)$",
                 message = "Invalid status. Must be one of: Completed, In Progress, Attempted, Bookmarked")
        private String status;
    }
}
