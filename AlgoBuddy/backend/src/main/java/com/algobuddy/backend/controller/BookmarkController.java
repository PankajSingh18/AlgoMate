package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.BookmarkDto;
import com.algobuddy.backend.dto.BookmarkRequestDto;
import com.algobuddy.backend.entity.Bookmark;
import com.algobuddy.backend.mapper.BookmarkMapper;
import com.algobuddy.backend.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
@Validated
@Tag(name = "Bookmarks", description = "Endpoints for managing user bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final BookmarkMapper bookmarkMapper;

    @GetMapping
    @Operation(summary = "Get bookmarks", description = "Retrieves a list of bookmarks for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookmarks")
    public ResponseEntity<List<BookmarkDto>> getBookmarks(@CurrentUserId UUID userId) {
        List<Bookmark> bookmarks = bookmarkService.getBookmarks(userId);
        List<BookmarkDto> dtos = bookmarks.stream()
                                          .map(bookmarkMapper::toDto)
                                          .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @Operation(summary = "Add bookmark", description = "Adds a new bookmark for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully added bookmark")
    public ResponseEntity<Void> addBookmark(@CurrentUserId UUID userId, 
                                            @Valid @RequestBody BookmarkRequestDto request) {
        bookmarkService.addBookmark(userId, request.getProblemId(), request.getTopicSlug());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @Operation(summary = "Remove bookmark", description = "Removes a specific bookmark for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully removed bookmark")
    public ResponseEntity<Void> removeBookmark(@CurrentUserId UUID userId, 
                                               @NotBlank(message = "problemId cannot be empty") @RequestParam String problemId) {
        bookmarkService.removeBookmark(userId, problemId);
        return ResponseEntity.ok().build();
    }
}
