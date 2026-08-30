package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.MySheet;
import com.algobuddy.backend.repository.MySheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MySheetService {

    private final MySheetRepository mySheetRepository;

    @Transactional(readOnly = true)
    public Page<MySheet> getMySheet(UUID userId, Pageable pageable) {
        return mySheetRepository.findByUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
    public List<MySheet> getMySheet(UUID userId) {
        return mySheetRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<MySheet> getSharedSheet(UUID userId) {
        return mySheetRepository.findByUserIdAndIsPublicTrue(userId);
    }

    @Transactional
    public void addToSheet(UUID userId, String problemId, String note, Boolean isPublic) {
        Optional<MySheet> existing = mySheetRepository.findByUserIdAndProblemId(userId, problemId);
        if (existing.isPresent()) {
            MySheet item = existing.get();
            if (item != null) {
                if (note != null) {
                    item.setNote(note);
                }
                if (isPublic != null) {
                    item.setPublic(isPublic);
                }
                mySheetRepository.save(item);
            }
        } else {
            MySheet item = new MySheet();
            item.setUserId(userId);
            item.setProblemId(problemId);
            item.setNote(note == null ? "" : note);
            item.setPublic(isPublic != null && isPublic);
            mySheetRepository.save(item);
        }
    }

    @Transactional
    public void updateVisibility(UUID userId, String problemId, boolean isPublic) {
        mySheetRepository.findByUserIdAndProblemId(userId, problemId)
                .ifPresent(item -> {
                    item.setPublic(isPublic);
                    mySheetRepository.save(item);
                });
    }

    @Transactional
    public void removeFromSheet(UUID userId, String problemId) {
        mySheetRepository.findByUserIdAndProblemId(userId, problemId)
                .ifPresent(mySheetRepository::delete);
    }

    @Transactional
    public void cloneSheet(UUID sharedUserId, UUID targetUserId) {
        List<MySheet> sharedItems = mySheetRepository.findByUserIdAndIsPublicTrue(sharedUserId);
        if (sharedItems.isEmpty()) {
            throw new IllegalStateException("This user has not shared any sheet items");
        }

        List<String> problemIds = sharedItems.stream()
                .map(MySheet::getProblemId)
                .toList();

        List<MySheet> existingItems = mySheetRepository.findByUserIdAndProblemIdIn(targetUserId, problemIds);
        Set<String> existingProblemIds = existingItems.stream()
                .map(MySheet::getProblemId)
                .collect(Collectors.toSet());

        List<MySheet> toSave = new ArrayList<>();
        for (MySheet sharedItem : sharedItems) {
            if (!existingProblemIds.contains(sharedItem.getProblemId())) {
                MySheet newItem = new MySheet();
                newItem.setUserId(targetUserId);
                newItem.setProblemId(sharedItem.getProblemId());
                newItem.setNote(null);
                newItem.setPublic(false);
                newItem.setSharedNotes(false);
                toSave.add(newItem);
            }
        }

        if (!toSave.isEmpty()) {
            mySheetRepository.saveAll(toSave);
        }
    }
}
