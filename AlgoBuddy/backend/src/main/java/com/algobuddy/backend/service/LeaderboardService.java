package com.algobuddy.backend.service;

import com.algobuddy.backend.dto.LeaderboardEntryDto;
import com.algobuddy.backend.entity.UserArenaProfile;
import com.algobuddy.backend.entity.UserPracticeStats;
import com.algobuddy.backend.entity.UserProfile;
import com.algobuddy.backend.repository.UserArenaProfileRepository;
import com.algobuddy.backend.repository.UserPracticeStatsRepository;
import com.algobuddy.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserPracticeStatsRepository statsRepository;
    private final UserArenaProfileRepository arenaRepository;
    private final UserProfileRepository profileRepository;

    public List<LeaderboardEntryDto> getGlobalStreakLeaderboard() {
        List<UserPracticeStats> stats = statsRepository.findAll(Sort.by(Sort.Direction.DESC, "currentStreak"));
        return mapToStreakEntries(stats);
    }

    public List<LeaderboardEntryDto> getGlobalArenaLeaderboard() {
        List<UserArenaProfile> profiles = arenaRepository.findAll(Sort.by(Sort.Direction.DESC, "rating"));
        return mapToArenaEntries(profiles);
    }

    private List<LeaderboardEntryDto> mapToStreakEntries(List<UserPracticeStats> statsList) {
        List<UUID> userIds = statsList.stream().map(UserPracticeStats::getUserId).toList();
        Map<UUID, UserProfile> profileMap = profileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, p -> p));

        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (UserPracticeStats stat : statsList) {
            UserProfile profile = profileMap.get(stat.getUserId());
            result.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(stat.getUserId())
                    .username(profile != null ? profile.getUsername() : "Anonymous")
                    .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                    .score(stat.getCurrentStreak())
                    .build());
        }
        return result;
    }

    private List<LeaderboardEntryDto> mapToArenaEntries(List<UserArenaProfile> profilesList) {
        List<UUID> userIds = profilesList.stream().map(UserArenaProfile::getUserId).toList();
        Map<UUID, UserProfile> profileMap = profileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, p -> p));

        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (UserArenaProfile arenaProfile : profilesList) {
            UserProfile profile = profileMap.get(arenaProfile.getUserId());
            result.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(arenaProfile.getUserId())
                    .username(profile != null ? profile.getUsername() : "Anonymous")
                    .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                    .score(arenaProfile.getRating())
                    .build());
        }
        return result;
    }
}
