package com.algobuddy.backend.mapper;

import com.algobuddy.backend.dto.BookmarkDto;
import com.algobuddy.backend.entity.Bookmark;
import org.springframework.stereotype.Component;

@Component
public class BookmarkMapper {

    public BookmarkDto toDto(Bookmark bookmark) {
        if (bookmark == null) {
            return null;
        }
        return BookmarkDto.builder()
                .problemId(bookmark.getProblemId())
                .topicSlug(bookmark.getTopicSlug())
                .createdAt(bookmark.getCreatedAt())
                .build();
    }
}
