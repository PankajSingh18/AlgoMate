package com.algobuddy.backend;

import com.algobuddy.backend.repository.BookmarkRepository;
import com.algobuddy.backend.service.ArenaService;
import com.algobuddy.backend.dto.InitMatchRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.UUID;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private BookmarkRepository bookmarkRepository;

	@Autowired
	private ArenaService arenaService;

	@Test
	void contextLoads() {
	}

	@Test
	void testQueryBookmarks() {
		try {
			bookmarkRepository.findByUserId(UUID.randomUUID());
			System.out.println("Query bookmarks succeeded!");
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	@Test
	void testInitMatchMock() {
		try {
			InitMatchRequest request = InitMatchRequest.builder()
				.matchId("mock-match-" + System.currentTimeMillis())
				.topic("Arrays")
				.difficulty("Easy")
				.build();
			arenaService.initMatch(UUID.randomUUID(), request);
			System.out.println("Init match succeeded!");
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}

