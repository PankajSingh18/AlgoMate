package com.algobuddy.backend.dto;

import lombok.Data;
import lombok.Builder;

import java.util.Map;

@Data
@Builder
public class ProgressResponse {
    private Map<String, ProgressDetail> progress;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer visualizedCount;
    private Integer dailySolved;
    private Integer weeklySolved;
    private Integer monthlySolved;

    @Data
    public static class ProgressDetail {
        private String status;
        private java.time.OffsetDateTime updatedAt;

        public ProgressDetail() {}
        public ProgressDetail(String status, java.time.OffsetDateTime updatedAt) {
            this.status = status;
            this.updatedAt = updatedAt;
        }
    }
}
