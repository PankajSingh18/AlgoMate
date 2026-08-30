package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MySheetDto {
    private String problemId;
    private String note;
    private boolean isPublic;
    private boolean sharedNotes;
    private OffsetDateTime addedAt;
}
