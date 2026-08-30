package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitMatchRequest {
    private String matchId;
    private String topic;
    private String difficulty;
}
