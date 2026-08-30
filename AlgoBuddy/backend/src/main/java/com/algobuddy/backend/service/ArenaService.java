package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.ArenaLeaderboardProjection;
import com.algobuddy.backend.dto.ArenaMatchResponse;
import com.algobuddy.backend.dto.ArenaProfileResponse;
import com.algobuddy.backend.entity.ArenaMatch;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.repository.ArenaMatchRepository;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArenaService {

    private static final Logger log = LoggerFactory.getLogger(ArenaService.class);

    private final UserArenaProfileRepository profileRepository;
    private final ArenaMatchRepository matchRepository;
    private final CacheManager cacheManager;

    private void checkMatchResultRateLimit(UUID userId) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(1);
        long recentCount = matchRepository.countRecentMatchResultsByUserId(userId, since);
        if (recentCount >= 3) {
            throw new IllegalStateException("Rate limit exceeded. Max 3 match results per minute.");
        }
    }

    @Cacheable(value = "arenaProfile", key = "#userId", unless = "#result == null")
    public ArenaProfileResponse getProfile(UUID userId) {
        if (!profileRepository.existsById(userId)) {
            try {
                createDefaultProfile(userId);
            } catch (DataIntegrityViolationException e) {
                log.debug("Profile already created by concurrent request for userId: {}", userId);
            }
        }
        
        ArenaLeaderboardProjection projection = profileRepository.findProfileWithUserDetails(userId)
                .orElseThrow(() -> new IllegalStateException("Profile not found after creation"));
        
        Integer rank = calculateRank(userId);
        
        return mapProjectionToResponse(projection, rank);
    }
    
    @Transactional(readOnly = true)
    @Cacheable(value = "arenaLeaderboard", unless = "#result == null")
    public List<ArenaProfileResponse> getLeaderboard() {
        List<ArenaLeaderboardProjection> topPlayers = profileRepository.findTopPlayersWithUserDetails(PageRequest.of(0, 50));
        
        int rank = 1;
        List<ArenaProfileResponse> result = new java.util.ArrayList<>();
        for (ArenaLeaderboardProjection projection : topPlayers) {
            result.add(mapProjectionToResponse(projection, rank++));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<ArenaMatchResponse> getMatchHistory(UUID userId) {
        List<ArenaMatch> recentMatches = matchRepository.findRecentMatchesByUserId(userId, PageRequest.of(0, 5));
        
        return recentMatches.stream()
                .map(match -> mapToMatchResponse(match, userId))
                .collect(Collectors.toList());
    }

    private UserArenaProfile createDefaultProfile(UUID userId) {
        UserArenaProfile newProfile = UserArenaProfile.builder()
                .userId(userId)
                .xp(0)
                .level(1)
                .rating(1200)
                .battlesWon(0)
                .battlesLost(0)
                .totalProblemsSolved(0)
                .build();
        return profileRepository.save(newProfile);
    }
    
    private Integer calculateRank(UUID userId) {
        Integer rank = profileRepository.findRankByUserId(userId);
        return rank != null ? rank : profileRepository.findTopPlayers(PageRequest.of(0, 1)).size() + 1;
    }

    private ArenaProfileResponse mapProjectionToResponse(ArenaLeaderboardProjection projection, Integer rank) {
        return ArenaProfileResponse.builder()
                .userId(projection.getUserId())
                .xp(projection.getXp())
                .level(projection.getLevel())
                .rating(projection.getRating())
                .battlesWon(projection.getBattlesWon())
                .battlesLost(projection.getBattlesLost())
                .totalProblemsSolved(projection.getTotalProblemsSolved())
                .rank(rank)
                .name(projection.getName())
                .avatarUrl(projection.getAvatarUrl())
                .build();
    }

    private ArenaMatchResponse mapToMatchResponse(ArenaMatch match, UUID requestingUserId) {
        boolean isPlayer1 = match.getPlayer1Id().equals(requestingUserId);
        UUID opponentId = isPlayer1 ? match.getPlayer2Id() : match.getPlayer1Id();
        
        // Fetch opponent name from db if present, default to "User [id]"
        String opponentName = profileRepository.findProfileWithUserDetails(opponentId)
                .map(ArenaLeaderboardProjection::getName)
                .orElse("User " + opponentId.toString().substring(0, 4));
        
        String result = "In Progress";
        if (match.getWinnerId() != null) {
            result = match.getWinnerId().equals(requestingUserId) ? "Victory" : "Defeat";
        } else if (match.getEndTime() != null) {
            result = "Draw";
        }
        
        return ArenaMatchResponse.builder()
                .id(match.getId())
                .opponentName(opponentName)
                .topic(match.getTopic())
                .difficulty(match.getDifficulty())
                .startTime(match.getStartTime())
                .result(result)
                .ratingChange(isPlayer1 ? match.getRatingChangeP1() : match.getRatingChangeP2())
                .xpAwarded(isPlayer1 ? match.getXpAwardedP1() : match.getXpAwardedP2())
                .build();
    }

    private void checkInitMatchRateLimit(UUID userId) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(1);
        long recentCount = matchRepository.countRecentInitiationsByUserId(userId, since);
        if (recentCount >= 5) {
            throw new IllegalStateException("Rate limit exceeded. Max 5 match initiations per minute.");
        }
    }

    @Transactional
    public void initMatch(UUID requestingUserId, com.algobuddy.backend.dto.InitMatchRequest request) {
        if (request.getMatchId() == null || request.getMatchId().isEmpty()) {
            throw new IllegalArgumentException("matchId is required");
        }

        checkInitMatchRateLimit(requestingUserId);

        if (matchRepository.findByMatchId(request.getMatchId()).isPresent()) {
            return;
        }

        UUID opponentId;
        if (request.getMatchId() != null && request.getMatchId().startsWith("mock-match-")) {
            // Bypass socket matchmaking verification for offline practice matches against AI Bots
            opponentId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        } else {
            // Verify the match pair via the WebSocket matchmaking server (Redis-backed)
            // This ensures the opponent actually consented through WebSocket matchmaking
            opponentId = verifyMatchmakingPair(request.getMatchId(), requestingUserId);
        }

        ArenaMatch match = ArenaMatch.builder()
                .matchId(request.getMatchId())
                .player1Id(requestingUserId)
                .player2Id(opponentId)
                .topic(request.getTopic() != null ? request.getTopic() : "Arrays")
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : "Easy")
                .startTime(java.time.LocalDateTime.now())
                .status(ArenaMatch.MatchStatus.PENDING)
                .build();

        matchRepository.save(match);
    }

    private UUID verifyMatchmakingPair(String matchId, UUID requestingUserId) {
        String socketServerUrl = System.getenv("SOCKET_SERVER_URL");
        if (socketServerUrl == null || socketServerUrl.isEmpty()) {
            socketServerUrl = "http://localhost:4000";
        }
        try {
            java.net.URL url = new java.net.URL(socketServerUrl + "/api/verify-match/" + matchId + "/" + requestingUserId);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);

            int status = conn.getResponseCode();
            if (status == 200) {
                java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                // Parse JSON response
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode json = mapper.readTree(response.toString());

                if (json.has("verified") && json.get("verified").asBoolean()) {
                    if (json.has("opponentId") && !json.get("opponentId").isNull()) {
                        return UUID.fromString(json.get("opponentId").asText());
                    }
                }
            }
            conn.disconnect();
        } catch (Exception e) {
            log.error("Failed to verify matchmaking pair via socket server: {}", e.getMessage());
        }
        throw new SecurityException("Match verification failed. Opponent has not consented to this match.");
    }

    @Scheduled(fixedRate = 300_000)
    @Transactional
    public void expireStaleMatches() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
        int expired = matchRepository.expireStaleMatches(cutoff, ArenaMatch.MatchStatus.EXPIRED);
        if (expired > 0) {
            log.info("Expired {} stale arena matches older than {}", expired, cutoff);
        }
    }

    @Transactional
    @CacheEvict(value = "arenaLeaderboard", allEntries = true)
    public void recordMatchResult(UUID requestingUserId, com.algobuddy.backend.dto.RecordMatchRequest request) {
        checkMatchResultRateLimit(requestingUserId);

        String matchIdStr = request.getMatchId();
        if (matchIdStr == null || matchIdStr.isEmpty()) {
            throw new IllegalArgumentException("matchId is required");
        }

        boolean isWinner = request.isWinner();

        final int MAX_RETRIES = 3;
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                ArenaMatch existingMatch = matchRepository.findByMatchId(matchIdStr)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid match ID"));

                if (!existingMatch.getPlayer1Id().equals(requestingUserId) &&
                    !existingMatch.getPlayer2Id().equals(requestingUserId)) {
                    throw new SecurityException("User is not a participant in this match");
                }

                if (existingMatch.getWinnerId() != null) {
                    // Match result has already been recorded. We return silently to prevent
                    // duplicate submission exceptions from throwing 500 errors on the client.
                    return;
                }

                UUID opponentId = existingMatch.getPlayer1Id().equals(requestingUserId)
                    ? existingMatch.getPlayer2Id()
                    : existingMatch.getPlayer1Id();

                boolean isOpponentBot = opponentId.equals(UUID.fromString("00000000-0000-0000-0000-000000000000"));

                UserArenaProfile requestingUserProfile = profileRepository.findById(requestingUserId)
                        .orElseGet(() -> createDefaultProfile(requestingUserId));
                
                UserArenaProfile opponentProfile = null;
                if (!isOpponentBot) {
                    opponentProfile = profileRepository.findById(opponentId)
                            .orElseGet(() -> createDefaultProfile(opponentId));
                }

                int requestingUserRatingChange = isWinner ? 25 : -15;
                int opponentRatingChange = isWinner ? -15 : 25;

                int requestingUserXp = isWinner ? 50 : 10;
                int opponentXp = isWinner ? 10 : 50;

                requestingUserProfile.setRating(Math.max(0, requestingUserProfile.getRating() + requestingUserRatingChange));
                requestingUserProfile.setXp(requestingUserProfile.getXp() + requestingUserXp);
                requestingUserProfile.setLevel((requestingUserProfile.getXp() / 1000) + 1);
                requestingUserProfile.setTotalProblemsSolved(requestingUserProfile.getTotalProblemsSolved() + (isWinner ? 1 : 0));
                if (isWinner) requestingUserProfile.setBattlesWon(requestingUserProfile.getBattlesWon() + 1);
                else requestingUserProfile.setBattlesLost(requestingUserProfile.getBattlesLost() + 1);

                if (!isOpponentBot && opponentProfile != null) {
                    opponentProfile.setRating(Math.max(0, opponentProfile.getRating() + opponentRatingChange));
                    opponentProfile.setXp(opponentProfile.getXp() + opponentXp);
                    opponentProfile.setLevel((opponentProfile.getXp() / 1000) + 1);
                    opponentProfile.setTotalProblemsSolved(opponentProfile.getTotalProblemsSolved() + (!isWinner ? 1 : 0));
                    if (!isWinner) opponentProfile.setBattlesWon(opponentProfile.getBattlesWon() + 1);
                    else opponentProfile.setBattlesLost(opponentProfile.getBattlesLost() + 1);
                }

                profileRepository.save(requestingUserProfile);
                if (!isOpponentBot && opponentProfile != null) {
                    profileRepository.save(opponentProfile);
                }

                existingMatch.setWinnerId(isWinner ? requestingUserId : opponentId);
                existingMatch.setEndTime(java.time.LocalDateTime.now());
                existingMatch.setStatus(ArenaMatch.MatchStatus.COMPLETED);

                boolean isReqUserPlayer1 = requestingUserId.equals(existingMatch.getPlayer1Id());
                existingMatch.setRatingChangeP1(isReqUserPlayer1 ? requestingUserRatingChange : opponentRatingChange);
                existingMatch.setRatingChangeP2(isReqUserPlayer1 ? opponentRatingChange : requestingUserRatingChange);
                existingMatch.setXpAwardedP1(isReqUserPlayer1 ? requestingUserXp : opponentXp);
                existingMatch.setXpAwardedP2(isReqUserPlayer1 ? opponentXp : requestingUserXp);

                matchRepository.save(existingMatch);

                org.springframework.cache.Cache profileCache = cacheManager.getCache("arenaProfile");
                if (profileCache != null) {
                    profileCache.evict(requestingUserId);
                    if (!isOpponentBot) {
                        profileCache.evict(opponentId);
                    }
                }
                org.springframework.cache.Cache leaderboardCache = cacheManager.getCache("arenaLeaderboard");
                if (leaderboardCache != null) {
                    leaderboardCache.clear();
                }

                return;
            } catch (ObjectOptimisticLockingFailureException | DataIntegrityViolationException e) {
                if (attempt == MAX_RETRIES) {
                    log.error("Failed to record match result after {} attempts", MAX_RETRIES, e);
                    throw e;
                }
                log.warn("Optimistic lock failure recording match result, retry {}/{}", attempt, MAX_RETRIES);
            }
        }
    }

    @Transactional(readOnly = true)
    public com.algobuddy.backend.dto.DailyChallengeResponse getDailyChallenge() {
        // Hardcoded list of challenges to simulate a rotating daily problem
        List<com.algobuddy.backend.dto.DailyChallengeResponse> pool = List.of(
            new com.algobuddy.backend.dto.DailyChallengeResponse("valid-anagram", "Valid Anagram", "Solve this classic string problem to earn bonus daily XP and a special profile badge.", "Easy", "Strings", 250, "https://leetcode.com/problems/valid-anagram/"),
            new com.algobuddy.backend.dto.DailyChallengeResponse("two-sum", "Two Sum", "Find two numbers in the array that add up to the target value.", "Easy", "Arrays", 200, "https://leetcode.com/problems/two-sum/"),
            new com.algobuddy.backend.dto.DailyChallengeResponse("lru-cache", "LRU Cache", "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", "Medium", "Design", 400, "https://leetcode.com/problems/lru-cache/"),
            new com.algobuddy.backend.dto.DailyChallengeResponse("merge-intervals", "Merge Intervals", "Merge all overlapping intervals into one.", "Medium", "Arrays", 350, "https://leetcode.com/problems/merge-intervals/")
        );

        long daysSinceEpoch = java.time.LocalDate.now().toEpochDay();
        int index = (int) (daysSinceEpoch % pool.size());
        
        return pool.get(index);
    }
}
