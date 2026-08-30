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
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;

@Service
@RequiredArgsConstructor
public class ArenaService {

    private static final Logger log = LoggerFactory.getLogger(ArenaService.class);
    private static final UUID BOT_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");
    private static final int MAX_DAILY_MATCH_RESULTS = 30;

    private final UserArenaProfileRepository profileRepository;
    private final ArenaMatchRepository matchRepository;
    private final CacheManager cacheManager;
    private final PlatformTransactionManager transactionManager;

    private void checkMatchResultRateLimit(UUID userId) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(1);
        long recentCount = matchRepository.countRecentMatchResultsByUserId(userId, since);
        if (recentCount >= 3) {
            throw new IllegalStateException("Rate limit exceeded. Max 3 match results per minute.");
        }
    }

    private void checkMatchResultDailyLimit(UUID userId) {
        LocalDateTime since = LocalDateTime.now().minusDays(1);
        long recentCount = matchRepository.countMatchResultsSinceByUserId(userId, since);
        if (recentCount >= MAX_DAILY_MATCH_RESULTS) {
            throw new IllegalStateException("Daily match-result limit exceeded. Max "
                    + MAX_DAILY_MATCH_RESULTS + " match results per day.");
        }
    }

    @Transactional
    public ArenaProfileResponse getProfile(UUID userId) {
        if (!profileRepository.existsById(userId)) {
            try {
                createDefaultProfile(userId);
            } catch (DataIntegrityViolationException e) {
                log.debug("Profile already created by concurrent request for userId: {}", userId);
            }
        }
        
        ArenaProfileResponse cachedProfile = null;
        org.springframework.cache.Cache cache = cacheManager.getCache("arenaProfile");
        if (cache != null) {
            cachedProfile = cache.get(userId, ArenaProfileResponse.class);
        }
        
        if (cachedProfile == null) {
            ArenaLeaderboardProjection projection = profileRepository.findProfileWithUserDetails(userId)
                    .orElseThrow(() -> new IllegalStateException("Profile not found after creation"));
            cachedProfile = mapProjectionToResponse(projection, null);
            if (cache != null) {
                cache.put(userId, cachedProfile);
            }
        }
        
        Integer rank = calculateRank(userId);
        
        return ArenaProfileResponse.builder()
                .userId(cachedProfile.getUserId())
                .xp(cachedProfile.getXp())
                .level(cachedProfile.getLevel())
                .rating(cachedProfile.getRating())
                .battlesWon(cachedProfile.getBattlesWon())
                .battlesLost(cachedProfile.getBattlesLost())
                .totalProblemsSolved(cachedProfile.getTotalProblemsSolved())
                .rank(rank)
                .name(cachedProfile.getName())
                .avatarUrl(cachedProfile.getAvatarUrl())
                .build();
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
        
        List<UUID> opponentIds = recentMatches.stream()
                .map(match -> match.getPlayer1Id().equals(userId) ? match.getPlayer2Id() : match.getPlayer1Id())
                .distinct()
                .collect(Collectors.toList());

        java.util.Map<UUID, String> opponentNameMap = new java.util.HashMap<>();
        if (!opponentIds.isEmpty()) {
            List<ArenaLeaderboardProjection> profiles = profileRepository.findProfilesWithUserDetailsIn(opponentIds);
            for (ArenaLeaderboardProjection profile : profiles) {
                opponentNameMap.put(profile.getUserId(), profile.getName());
            }
        }

        return recentMatches.stream()
                .map(match -> mapToMatchResponse(match, userId, opponentNameMap))
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

    private ArenaMatchResponse mapToMatchResponse(ArenaMatch match, UUID requestingUserId, java.util.Map<UUID, String> opponentNameMap) {
        boolean isPlayer1 = match.getPlayer1Id().equals(requestingUserId);
        UUID opponentId = isPlayer1 ? match.getPlayer2Id() : match.getPlayer1Id();
        
        // Fetch opponent name from pre-fetched map, default to "User [id]"
        String opponentName = opponentNameMap.getOrDefault(opponentId, "User " + opponentId.toString().substring(0, 4));
        
        String result = "In Progress";
        if (match.getStatus() == ArenaMatch.MatchStatus.EXPIRED) {
            result = "Expired";
        } else if (match.getWinnerId() != null) {
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

        checkInitMatchRateLimit(requestingUserId);

        if (matchRepository.findByMatchId(request.getMatchId()).isPresent()) {
            return;
        }

        UUID opponentId;
        if (request.getMatchId().startsWith("mock-match-")) {
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
        if (matchId == null || !matchId.matches("^(match|mock-match)-[a-zA-Z0-9-]+$")) {
            throw new IllegalArgumentException("Invalid matchId format.");
        }
        String socketServerUrl = System.getenv("SOCKET_SERVER_URL");
        if (socketServerUrl == null || socketServerUrl.isEmpty()) {
            socketServerUrl = "http://localhost:4000";
        }
        java.net.HttpURLConnection conn = null;
        try {
            java.net.URL url = new java.net.URL(socketServerUrl + "/api/verify-match/" + matchId + "/" + requestingUserId);
            conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);

            // Forward the authenticated user's JWT token to the socket server
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
                conn.setRequestProperty("Authorization", "Bearer " + jwt.getTokenValue());
            }

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
        } catch (Exception e) {
            log.error("Failed to verify matchmaking pair via socket server: {}", e.getMessage());
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        throw new SecurityException("Match verification failed. Opponent has not consented to this match.");
    }

    UUID verifyMatchResult(String matchId, UUID requestingUserId) {
        if (matchId == null || !matchId.matches("^(match|mock-match)-[a-zA-Z0-9-]+$")) {
            throw new IllegalArgumentException("Invalid matchId format.");
        }
        String socketServerUrl = System.getenv("SOCKET_SERVER_URL");
        if (socketServerUrl == null || socketServerUrl.isEmpty()) {
            socketServerUrl = "http://localhost:4000";
        }
        HttpURLConnection conn = null;
        try {
            URL url = new URL(socketServerUrl + "/api/verify-match-result/" + matchId + "/" + requestingUserId);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);

            // Forward the authenticated user's JWT token to the socket server
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
                conn.setRequestProperty("Authorization", "Bearer " + jwt.getTokenValue());
            }

            int status = conn.getResponseCode();
            if (status == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                ObjectMapper mapper = new ObjectMapper();
                JsonNode json = mapper.readTree(response.toString());

                if (json.has("verified") && json.get("verified").asBoolean()) {
                    if (json.has("winnerId") && !json.get("winnerId").isNull()) {
                        return UUID.fromString(json.get("winnerId").asText());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to verify match result via socket server: {}", e.getMessage());
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        throw new SecurityException("Match result verification failed");
    }

    @Scheduled(fixedRate = 300_000)
    @Transactional
    public void expireStaleMatches() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
        LocalDateTime now = LocalDateTime.now();
        int expired = matchRepository.expireStaleMatches(cutoff, ArenaMatch.MatchStatus.EXPIRED, now);
        if (expired > 0) {
            log.info("Expired {} stale arena matches older than {}", expired, cutoff);
        }
    }

    @CacheEvict(value = "arenaLeaderboard", allEntries = true)
    public void recordMatchResult(UUID requestingUserId, com.algobuddy.backend.dto.RecordMatchRequest request) {
        checkMatchResultRateLimit(requestingUserId);
        checkMatchResultDailyLimit(requestingUserId);

        String matchIdStr = request.getMatchId();
        if (matchIdStr == null || matchIdStr.isEmpty()) {
            throw new IllegalArgumentException("matchId is required");
        }

        ArenaMatch existingMatchPre = matchRepository.findByMatchId(matchIdStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid match ID"));

        if (!existingMatchPre.getPlayer1Id().equals(requestingUserId) &&
            !existingMatchPre.getPlayer2Id().equals(requestingUserId)) {
            throw new SecurityException("User is not a participant in this match");
        }

        if (existingMatchPre.getStatus() == ArenaMatch.MatchStatus.COMPLETED || existingMatchPre.getWinnerId() != null) {
            return;
        }

        if (existingMatchPre.getStatus() == ArenaMatch.MatchStatus.EXPIRED) {
            throw new IllegalStateException("This match has expired and cannot accept results");
        }

        boolean isWinner;
        final int MAX_RETRIES = 3;

        if (matchIdStr.startsWith("mock-match-")) {
            isWinner = request.isWinner();
        } else {
            UUID verifiedWinnerId = null;
            for (int verifyAttempt = 1; verifyAttempt <= MAX_RETRIES; verifyAttempt++) {
                try {
                    verifiedWinnerId = verifyMatchResult(matchIdStr, requestingUserId);
                    break;
                } catch (SecurityException e) {
                    if (verifyAttempt == MAX_RETRIES) throw e;
                    log.warn("Verify failed, retrying {}/{}", verifyAttempt, MAX_RETRIES);
                    try { Thread.sleep(1000L * verifyAttempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); break; }
                }
            }
            isWinner = requestingUserId.equals(verifiedWinnerId);
        }
        final boolean finalIsWinner = isWinner;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {

                // Execute each retry attempt in an isolated transaction.
                final TransactionTemplate retryTransaction = new TransactionTemplate(transactionManager);
                retryTransaction.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

                UUID opponentId = retryTransaction.execute(status -> {

                    ArenaMatch existingMatch = matchRepository.findByMatchId(matchIdStr)
                            .orElseThrow(() -> new IllegalArgumentException("Invalid match ID"));

                    if (!existingMatch.getPlayer1Id().equals(requestingUserId) &&
                        !existingMatch.getPlayer2Id().equals(requestingUserId)) {
                        throw new SecurityException("User is not a participant in this match");
                    }

                    if (existingMatch.getStatus() == ArenaMatch.MatchStatus.EXPIRED) {
                        throw new IllegalStateException("This match has expired and cannot accept results");
                    }

                    if (existingMatch.getStatus() == ArenaMatch.MatchStatus.COMPLETED) {
                        return null;
                    }

                    if (existingMatch.getWinnerId() != null) {
                        // Match result has already been recorded. We return silently to prevent
                        // duplicate submission exceptions from throwing 500 errors on the client.
                        return null;
                    }

                    UUID opponentUserId = existingMatch.getPlayer1Id().equals(requestingUserId)
                        ? existingMatch.getPlayer2Id()
                        : existingMatch.getPlayer1Id();

                    boolean isOpponentBot = opponentUserId.equals(BOT_USER_ID);

                    UserArenaProfile requestingUserProfile = profileRepository.findById(requestingUserId)
                            .orElseGet(() -> createDefaultProfile(requestingUserId));
                
                    UserArenaProfile opponentProfile = null;
                    if (!isOpponentBot) {
                        opponentProfile = profileRepository.findById(opponentUserId)
                                .orElseGet(() -> createDefaultProfile(opponentUserId));
                    }

                    int requestingUserRatingChange = 0;
                    int opponentRatingChange = 0;
                    int requestingUserXp = 0;
                    int opponentXp = 0;

                    if (!isOpponentBot) {
                        requestingUserRatingChange = finalIsWinner ? 25 : -15;
                        opponentRatingChange = finalIsWinner ? -15 : 25;
                        requestingUserXp = finalIsWinner ? 50 : 10;
                        opponentXp = finalIsWinner ? 10 : 50;
                    }

                    requestingUserProfile.setRating(Math.max(0, requestingUserProfile.getRating() + requestingUserRatingChange));
                    requestingUserProfile.setXp(requestingUserProfile.getXp() + requestingUserXp);
                    requestingUserProfile.setLevel((requestingUserProfile.getXp() / 1000) + 1);
                    if (!isOpponentBot) {
                        requestingUserProfile.setTotalProblemsSolved(requestingUserProfile.getTotalProblemsSolved() + (finalIsWinner ? 1 : 0));
                        if (finalIsWinner) requestingUserProfile.setBattlesWon(requestingUserProfile.getBattlesWon() + 1);
                        else requestingUserProfile.setBattlesLost(requestingUserProfile.getBattlesLost() + 1);
                    }

                    if (!isOpponentBot && opponentProfile != null) {
                        opponentProfile.setRating(Math.max(0, opponentProfile.getRating() + opponentRatingChange));
                        opponentProfile.setXp(opponentProfile.getXp() + opponentXp);
                        opponentProfile.setLevel((opponentProfile.getXp() / 1000) + 1);
                        opponentProfile.setTotalProblemsSolved(opponentProfile.getTotalProblemsSolved() + (!finalIsWinner ? 1 : 0));
                        if (!finalIsWinner) opponentProfile.setBattlesWon(opponentProfile.getBattlesWon() + 1);
                        else opponentProfile.setBattlesLost(opponentProfile.getBattlesLost() + 1);
                    }

                    profileRepository.save(requestingUserProfile);
                    if (!isOpponentBot && opponentProfile != null) {
                        profileRepository.save(opponentProfile);
                    }

                    existingMatch.setWinnerId(finalIsWinner ? requestingUserId : opponentUserId);
                    existingMatch.setEndTime(java.time.LocalDateTime.now());
                    existingMatch.setStatus(ArenaMatch.MatchStatus.COMPLETED);

                    boolean isReqUserPlayer1 = requestingUserId.equals(existingMatch.getPlayer1Id());
                    existingMatch.setRatingChangeP1(isReqUserPlayer1 ? requestingUserRatingChange : opponentRatingChange);
                    existingMatch.setRatingChangeP2(isReqUserPlayer1 ? opponentRatingChange : requestingUserRatingChange);
                    existingMatch.setXpAwardedP1(isReqUserPlayer1 ? requestingUserXp : opponentXp);
                    existingMatch.setXpAwardedP2(isReqUserPlayer1 ? opponentXp : requestingUserXp);

                    matchRepository.save(existingMatch);

                    return opponentUserId;
                });

                if (opponentId == null) {
                    return;
                }

                boolean isOpponentBot = opponentId.equals(BOT_USER_ID);

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
                log.warn("Lock failure, retrying {}/{} with fresh verification", attempt, MAX_RETRIES);
            } catch (SecurityException e) {
                throw e;
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
