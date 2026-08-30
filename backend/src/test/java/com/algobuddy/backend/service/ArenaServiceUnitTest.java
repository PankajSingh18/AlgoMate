package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaLeaderboardProjection;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.dto.RecordMatchRequest;
import com.algobuddy.backend.entity.ArenaMatch;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ArenaServiceUnitTest {

    private UserArenaProfileRepository profileRepository;
    private ArenaMatchRepository matchRepository;
    private CacheManager cacheManager;
    private PlatformTransactionManager transactionManager;
    private Cache cache;
    private ArenaService arenaService;

    @BeforeEach
    public void setUp() {
        profileRepository = mock(UserArenaProfileRepository.class);
        matchRepository = mock(ArenaMatchRepository.class);
        cacheManager = mock(CacheManager.class);
        transactionManager = mock(PlatformTransactionManager.class);
        cache = mock(Cache.class);
        when(cacheManager.getCache(anyString())).thenReturn(cache);
        arenaService = new ArenaService(profileRepository, matchRepository, cacheManager, transactionManager);
    }

    @Test
    public void testGetProfileReturnsCorrectRank() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(1500);
        when(projection.getLevel()).thenReturn(2);
        when(projection.getRating()).thenReturn(1400);
        when(projection.getBattlesWon()).thenReturn(5);
        when(projection.getBattlesLost()).thenReturn(3);
        when(projection.getTotalProblemsSolved()).thenReturn(10);
        when(projection.getName()).thenReturn("TestUser");
        when(projection.getAvatarUrl()).thenReturn("http://avatar.url");

        when(profileRepository.existsById(userId)).thenReturn(true);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        when(profileRepository.findRankByUserId(userId)).thenReturn(42);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(userId, response.getUserId());
        assertEquals(1500, response.getXp());
        assertEquals(1400, response.getRating());
        assertEquals(42, response.getRank());
        assertEquals("TestUser", response.getName());
        assertEquals("http://avatar.url", response.getAvatarUrl());

        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
    }

    @Test
    public void testCalculateRankWhenRankIsNull() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(0);
        when(projection.getLevel()).thenReturn(1);
        when(projection.getRating()).thenReturn(1200);
        when(projection.getBattlesWon()).thenReturn(0);
        when(projection.getBattlesLost()).thenReturn(0);
        when(projection.getTotalProblemsSolved()).thenReturn(0);
        when(projection.getName()).thenReturn("NewUser");
        when(projection.getAvatarUrl()).thenReturn("");

        when(profileRepository.existsById(userId)).thenReturn(true);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        
        // Simulate no rank found
        when(profileRepository.findRankByUserId(userId)).thenReturn(null);
        
        // Mock findTopPlayers to return empty list (size = 0)
        when(profileRepository.findTopPlayers(any())).thenReturn(java.util.Collections.emptyList());

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(1, response.getRank()); // size + 1 = 0 + 1 = 1

        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
        verify(profileRepository, times(1)).findTopPlayers(any());
    }

    @Test
    public void testGetProfileCreatesDefaultProfileIfNotFound() {
        UUID userId = UUID.randomUUID();
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(userId);
        when(projection.getXp()).thenReturn(0);
        when(projection.getLevel()).thenReturn(1);
        when(projection.getRating()).thenReturn(1200);

        when(profileRepository.existsById(userId)).thenReturn(false);
        when(profileRepository.findProfileWithUserDetails(userId)).thenReturn(Optional.of(projection));
        when(profileRepository.findRankByUserId(userId)).thenReturn(1);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, times(1)).save(any(UserArenaProfile.class));
        verify(profileRepository, times(1)).findProfileWithUserDetails(userId);
    }

    @Test
    public void testGetProfileRecalculatesRankOnCacheHit() {
        UUID userId = UUID.randomUUID();
        
        ArenaProfileResponse cachedResponse = ArenaProfileResponse.builder()
                .userId(userId)
                .xp(1500)
                .level(2)
                .rating(1400)
                .battlesWon(5)
                .battlesLost(3)
                .totalProblemsSolved(10)
                .rank(null)
                .name("TestUser")
                .avatarUrl("http://avatar.url")
                .build();
        
        when(profileRepository.existsById(userId)).thenReturn(true);
        when(cache.get(userId, ArenaProfileResponse.class)).thenReturn(cachedResponse);
        when(profileRepository.findRankByUserId(userId)).thenReturn(12);

        ArenaProfileResponse response = arenaService.getProfile(userId);

        assertNotNull(response);
        assertEquals(userId, response.getUserId());
        assertEquals(1400, response.getRating());
        assertEquals(12, response.getRank());
        assertEquals("TestUser", response.getName());

        verify(profileRepository, times(1)).existsById(userId);
        verify(profileRepository, never()).findProfileWithUserDetails(userId);
        verify(profileRepository, times(1)).findRankByUserId(userId);
        
        // Assert that the returned payload contains the recalculated rank
        // and that the original cached reference was not mutated directly
        assertNull(cachedResponse.getRank(), "Original cached object reference should remain unmutated");
    }

    @Test
    public void testRecordMatchResult_WinnerSuccess() {
        UUID p1Id = UUID.randomUUID();
        UUID p2Id = UUID.randomUUID();
        String matchId = "match-12345";

        ArenaMatch match = ArenaMatch.builder()
                .matchId(matchId)
                .player1Id(p1Id)
                .player2Id(p2Id)
                .status(ArenaMatch.MatchStatus.PENDING)
                .build();

        RecordMatchRequest request = RecordMatchRequest.builder()
                .matchId(matchId)
                .isWinner(true)
                .build();

        UserArenaProfile p1Profile = UserArenaProfile.builder().userId(p1Id).xp(100).rating(1200).build();
        UserArenaProfile p2Profile = UserArenaProfile.builder().userId(p2Id).xp(100).rating(1200).build();

        when(matchRepository.findByMatchId(matchId)).thenReturn(Optional.of(match));
        when(profileRepository.findById(p1Id)).thenReturn(Optional.of(p1Profile));
        when(profileRepository.findById(p2Id)).thenReturn(Optional.of(p2Profile));
        when(transactionManager.getTransaction(any())).thenReturn(mock(TransactionStatus.class));

        // Create a spy of arenaService to mock verifyMatchResult
        ArenaService spyService = spy(arenaService);
        doReturn(p1Id).when(spyService).verifyMatchResult(matchId, p1Id);

        // Run the service call
        spyService.recordMatchResult(p1Id, request);

        // Assertions
        assertEquals(ArenaMatch.MatchStatus.COMPLETED, match.getStatus());
        assertEquals(p1Id, match.getWinnerId());
        assertEquals(1225, p1Profile.getRating()); // Winner rating +25
        assertEquals(150, p1Profile.getXp()); // Winner XP +50
        assertEquals(1185, p2Profile.getRating()); // Loser rating -15
        assertEquals(110, p2Profile.getXp()); // Loser XP +10
        
        verify(matchRepository, times(1)).save(match);
        verify(profileRepository, times(1)).save(p1Profile);
        verify(profileRepository, times(1)).save(p2Profile);
    }

    @Test
    public void testRecordMatchResult_LoserSuccess() {
        UUID p1Id = UUID.randomUUID();
        UUID p2Id = UUID.randomUUID();
        String matchId = "match-12345";

        ArenaMatch match = ArenaMatch.builder()
                .matchId(matchId)
                .player1Id(p1Id)
                .player2Id(p2Id)
                .status(ArenaMatch.MatchStatus.PENDING)
                .build();

        RecordMatchRequest request = RecordMatchRequest.builder()
                .matchId(matchId)
                .isWinner(false)
                .build();

        UserArenaProfile p1Profile = UserArenaProfile.builder().userId(p1Id).xp(100).rating(1200).build();
        UserArenaProfile p2Profile = UserArenaProfile.builder().userId(p2Id).xp(100).rating(1200).build();

        when(matchRepository.findByMatchId(matchId)).thenReturn(Optional.of(match));
        when(profileRepository.findById(p1Id)).thenReturn(Optional.of(p1Profile));
        when(profileRepository.findById(p2Id)).thenReturn(Optional.of(p2Profile));
        when(transactionManager.getTransaction(any())).thenReturn(mock(TransactionStatus.class));

        // Create a spy of arenaService to mock verifyMatchResult (p2Id is the verified winner)
        ArenaService spyService = spy(arenaService);
        doReturn(p2Id).when(spyService).verifyMatchResult(matchId, p1Id);

        // Run the service call (p1Id is the loser requesting)
        spyService.recordMatchResult(p1Id, request);

        // Assertions
        assertEquals(ArenaMatch.MatchStatus.COMPLETED, match.getStatus());
        assertEquals(p2Id, match.getWinnerId());
        assertEquals(1185, p1Profile.getRating()); // Loser rating -15
        assertEquals(110, p1Profile.getXp()); // Loser XP +10
        assertEquals(1225, p2Profile.getRating()); // Winner rating +25
        assertEquals(150, p2Profile.getXp()); // Winner XP +50
    }

    @Test
    public void testRecordMatchResult_MockMatchAgainstBotHasNoRatingXPChanges() {
        UUID p1Id = UUID.randomUUID();
        UUID botId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        String matchId = "mock-match-12345";

        ArenaMatch match = ArenaMatch.builder()
                .matchId(matchId)
                .player1Id(p1Id)
                .player2Id(botId)
                .status(ArenaMatch.MatchStatus.PENDING)
                .build();

        RecordMatchRequest request = RecordMatchRequest.builder()
                .matchId(matchId)
                .isWinner(true)
                .build();

        UserArenaProfile p1Profile = UserArenaProfile.builder().userId(p1Id).xp(100).rating(1200).build();

        when(matchRepository.findByMatchId(matchId)).thenReturn(Optional.of(match));
        when(profileRepository.findById(p1Id)).thenReturn(Optional.of(p1Profile));
        when(transactionManager.getTransaction(any())).thenReturn(mock(TransactionStatus.class));

        // Call directly
        arenaService.recordMatchResult(p1Id, request);

        // Assertions
        assertEquals(ArenaMatch.MatchStatus.COMPLETED, match.getStatus());
        assertEquals(p1Id, match.getWinnerId());
        assertEquals(1200, p1Profile.getRating()); // Rating unchanged for mock match!
        assertEquals(100, p1Profile.getXp()); // XP unchanged for mock match!
    }

    @Test
    public void testRecordMatchResult_NotParticipantThrowsSecurityException() {
        UUID p1Id = UUID.randomUUID();
        UUID p2Id = UUID.randomUUID();
        UUID nonParticipantId = UUID.randomUUID();
        String matchId = "match-12345";

        ArenaMatch match = ArenaMatch.builder()
                .matchId(matchId)
                .player1Id(p1Id)
                .player2Id(p2Id)
                .status(ArenaMatch.MatchStatus.PENDING)
                .build();

        RecordMatchRequest request = RecordMatchRequest.builder()
                .matchId(matchId)
                .isWinner(true)
                .build();

        when(matchRepository.findByMatchId(matchId)).thenReturn(Optional.of(match));

        assertThrows(SecurityException.class, () -> {
            arenaService.recordMatchResult(nonParticipantId, request);
        });
    }

    @Test
    public void testRecordMatchResult_CompletedMatchReturnsSilently() {
        UUID p1Id = UUID.randomUUID();
        UUID p2Id = UUID.randomUUID();
        String matchId = "match-12345";

        ArenaMatch match = ArenaMatch.builder()
                .matchId(matchId)
                .player1Id(p1Id)
                .player2Id(p2Id)
                .status(ArenaMatch.MatchStatus.COMPLETED)
                .winnerId(p1Id)
                .build();

        RecordMatchRequest request = RecordMatchRequest.builder()
                .matchId(matchId)
                .isWinner(true)
                .build();

        when(matchRepository.findByMatchId(matchId)).thenReturn(Optional.of(match));

        // Should return silently and not call verifyMatchResult
        ArenaService spyService = spy(arenaService);
        spyService.recordMatchResult(p1Id, request);

        verify(spyService, never()).verifyMatchResult(anyString(), any(UUID.class));
    }

    @Test
    public void testGetMatchHistoryResolvesNPlus1() {
        UUID userId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        
        com.algobuddy.backend.entity.ArenaMatch match1 = com.algobuddy.backend.entity.ArenaMatch.builder()
                .id(UUID.randomUUID())
                .matchId("match-1")
                .player1Id(userId)
                .player2Id(opponentId)
                .topic("Arrays")
                .difficulty("Easy")
                .startTime(java.time.LocalDateTime.now())
                .status(com.algobuddy.backend.entity.ArenaMatch.MatchStatus.COMPLETED)
                .winnerId(userId)
                .build();

        when(matchRepository.findRecentMatchesByUserId(eq(userId), any())).thenReturn(java.util.List.of(match1));
        
        ArenaLeaderboardProjection projection = mock(ArenaLeaderboardProjection.class);
        when(projection.getUserId()).thenReturn(opponentId);
        when(projection.getName()).thenReturn("OpponentUser");
        
        when(profileRepository.findProfilesWithUserDetailsIn(any())).thenReturn(java.util.List.of(projection));

        java.util.List<com.algobuddy.backend.dto.ArenaMatchResponse> history = arenaService.getMatchHistory(userId);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals("OpponentUser", history.get(0).getOpponentName());
        assertEquals("Victory", history.get(0).getResult());

        verify(matchRepository, times(1)).findRecentMatchesByUserId(eq(userId), any());
        verify(profileRepository, times(1)).findProfilesWithUserDetailsIn(any());
        verify(profileRepository, never()).findProfileWithUserDetails(any());
    }
}

