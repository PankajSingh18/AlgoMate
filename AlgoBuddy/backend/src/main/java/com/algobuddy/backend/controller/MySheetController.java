package com.algobuddy.backend.controller;

import com.algobuddy.backend.config.annotation.CurrentUserId;
import com.algobuddy.backend.dto.MySheetDto;
import com.algobuddy.backend.dto.MySheetRequestDto;
import com.algobuddy.backend.dto.MySheetResponseDto;
import com.algobuddy.backend.entity.MySheet;
import com.algobuddy.backend.mapper.MySheetMapper;
import com.algobuddy.backend.service.MySheetService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/mysheet")
@RequiredArgsConstructor
@Validated
@Tag(name = "My Sheet", description = "Endpoints for managing user's personal coding sheet")
public class MySheetController {

    private final MySheetService mySheetService;
    private final MySheetMapper mySheetMapper;

    @GetMapping
    @Operation(summary = "Get my sheet items", description = "Retrieves a list of items in the user's personal sheet.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved sheet items")
    public ResponseEntity<MySheetResponseDto> getMySheet(@CurrentUserId UUID userId) {
        List<MySheet> sheetItems = mySheetService.getMySheet(userId);
        List<MySheetDto> dtos = sheetItems.stream()
                                          .map(mySheetMapper::toDto)
                                          .toList();
        return ResponseEntity.ok(MySheetResponseDto.builder().items(dtos).build());
    }

    @PostMapping
    @Operation(summary = "Add to sheet", description = "Adds a problem to the user's personal sheet.")
    @ApiResponse(responseCode = "200", description = "Successfully added to sheet")
    public ResponseEntity<Void> addToSheet(@CurrentUserId UUID userId,
                                           @Valid @RequestBody MySheetRequestDto request) {
        mySheetService.addToSheet(userId, request.getProblemId(), request.getNote(), request.getIsPublic());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{problemId}/visibility")
    @Operation(summary = "Update sheet item visibility", description = "Updates the public visibility of a sheet item.")
    @ApiResponse(responseCode = "200", description = "Successfully updated visibility")
    public ResponseEntity<Void> updateVisibility(@CurrentUserId UUID userId,
                                                  @PathVariable String problemId,
                                                  @RequestBody java.util.Map<String, Boolean> body) {
        mySheetService.updateVisibility(userId, problemId, body.getOrDefault("isPublic", false));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @Operation(summary = "Remove from sheet", description = "Removes a problem from the user's personal sheet.")
    @ApiResponse(responseCode = "200", description = "Successfully removed from sheet")
    public ResponseEntity<Void> removeFromSheet(@CurrentUserId UUID userId,
                                                @NotBlank(message = "problemId cannot be empty") @RequestParam String problemId) {
        mySheetService.removeFromSheet(userId, problemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shared/{userId}")
    @Operation(summary = "Get shared sheet", description = "Retrieves the public sheet items for a given user ID.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved shared sheet items")
    public ResponseEntity<MySheetResponseDto> getSharedSheet(@PathVariable UUID userId) {
        List<MySheet> items = mySheetService.getSharedSheet(userId);
        List<MySheetDto> dtos = items.stream()
                .map(mySheetMapper::toDto)
                .peek(dto -> { if (!dto.isSharedNotes()) dto.setNote(null); })
                .collect(Collectors.toList());
        return ResponseEntity.ok(MySheetResponseDto.builder().items(dtos).build());
    }

    @PostMapping("/clone/{sharedUserId}")
    @Operation(summary = "Clone shared sheet", description = "Clones a shared sheet into the authenticated user's sheet.")
    @ApiResponse(responseCode = "200", description = "Successfully cloned sheet")
    public ResponseEntity<Void> cloneSharedSheet(@CurrentUserId UUID userId, @PathVariable UUID sharedUserId) {
        mySheetService.cloneSheet(sharedUserId, userId);
        return ResponseEntity.ok().build();
    }
}
