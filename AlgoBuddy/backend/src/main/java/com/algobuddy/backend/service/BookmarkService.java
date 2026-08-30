package com.algobuddy.backend.service;

import com.algobuddy.backend.entity.Bookmark;
import com.algobuddy.backend.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public Page<Bookmark> getBookmarks(UUID userId, Pageable pageable) {
        return bookmarkRepository.findByUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Bookmark> getBookmarks(UUID userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    @Transactional
    public void addBookmark(UUID userId, String problemId, String topicSlug) {
        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndProblemId(userId, problemId);
        if (existing.isEmpty()) {
            Bookmark bookmark = new Bookmark();
            bookmark.setUserId(userId);
            bookmark.setProblemId(problemId);
            bookmark.setTopicSlug(topicSlug);
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public void removeBookmark(UUID userId, String problemId) {
        bookmarkRepository.findByUserIdAndProblemId(userId, problemId)
                .ifPresent(bookmarkRepository::delete);
    }
}
