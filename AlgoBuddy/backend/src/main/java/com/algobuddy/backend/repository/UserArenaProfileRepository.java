package com.algobuddy.backend.repository;

import com.algobuddy.backend.dto.ArenaLeaderboardProjection;
import com.algobuddy.backend.entity.UserArenaProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserArenaProfileRepository extends JpaRepository<UserArenaProfile, UUID> {
    
    @Query(value = "SELECT * FROM user_arena_profiles p WHERE p.user_id != '00000000-0000-0000-0000-000000000000' ORDER BY p.rating DESC, p.xp DESC", nativeQuery = true)
    List<UserArenaProfile> findTopPlayers(Pageable pageable);

    @Query(value = """
            SELECT 
                p.user_id as userId, 
                p.xp as xp, 
                p.level as level, 
                p.rating as rating, 
                p.battles_won as battlesWon, 
                p.battles_lost as battlesLost, 
                p.total_problems_solved as totalProblemsSolved,
                COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as name,
                COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', '') as avatarUrl
            FROM public.user_arena_profiles p
            LEFT JOIN auth.users u ON p.user_id = u.id
            WHERE p.user_id != '00000000-0000-0000-0000-000000000000'
            ORDER BY p.rating DESC, p.xp DESC
            """, nativeQuery = true)
    List<ArenaLeaderboardProjection> findTopPlayersWithUserDetails(Pageable pageable);

    @Query(value = """
            SELECT 
                p.user_id as userId, 
                p.xp as xp, 
                p.level as level, 
                p.rating as rating, 
                p.battles_won as battlesWon, 
                p.battles_lost as battlesLost, 
                p.total_problems_solved as totalProblemsSolved,
                COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as name,
                COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', '') as avatarUrl
            FROM public.user_arena_profiles p
            LEFT JOIN auth.users u ON p.user_id = u.id
            WHERE p.user_id = :userId
            """, nativeQuery = true)
    Optional<ArenaLeaderboardProjection> findProfileWithUserDetails(@Param("userId") UUID userId);

    @Query(value = """
            SELECT COUNT(p.user_id) + 1
            FROM user_arena_profiles p
            CROSS JOIN (
                SELECT rating, xp
                FROM user_arena_profiles
                WHERE user_id = :userId
            ) u
            WHERE p.user_id != '00000000-0000-0000-0000-000000000000'
              AND (p.rating > u.rating OR (p.rating = u.rating AND p.xp > u.xp))
            """, nativeQuery = true)
    Integer findRankByUserId(@Param("userId") UUID userId);

}
