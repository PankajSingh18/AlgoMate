package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyChallengeResponse {
    private String id;
    private String title;
    private String description;
    private String difficulty;
    private String topic;
    private int xpAward;
    private String practiceUrl;
}
