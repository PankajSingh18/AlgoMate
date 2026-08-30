-- Supabase SQL script to create the user_arena_profiles table

CREATE TABLE IF NOT EXISTS public.user_arena_profiles (
    user_id UUID PRIMARY KEY,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    rating INTEGER NOT NULL DEFAULT 1200,
    battles_won INTEGER NOT NULL DEFAULT 0,
    battles_lost INTEGER NOT NULL DEFAULT 0,
    total_problems_solved INTEGER NOT NULL DEFAULT 0,
    version INTEGER
);

-- Enable Row Level Security (RLS) if needed, or leave it off if the backend handles it.
-- ALTER TABLE public.user_arena_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.arena_matches (
    id UUID PRIMARY KEY,
    player1_id UUID NOT NULL,
    player2_id UUID NOT NULL,
    winner_id UUID,
    topic VARCHAR(255),
    difficulty VARCHAR(50),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    rating_change_p1 INTEGER,
    rating_change_p2 INTEGER,
    xp_awarded_p1 INTEGER,
    xp_awarded_p2 INTEGER,
    match_id VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_arena_rating_xp ON public.user_arena_profiles (rating DESC, xp DESC);
CREATE INDEX IF NOT EXISTS idx_arena_matches_match_id ON public.arena_matches (match_id);

-- Migration: Add status column and indexes for match cleanup and rate limiting
ALTER TABLE public.arena_matches ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

CREATE INDEX IF NOT EXISTS idx_arena_matches_player1_start
    ON public.arena_matches (player1_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_arena_matches_player2_start
    ON public.arena_matches (player2_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_arena_matches_status_start
    ON public.arena_matches (status, start_time) WHERE status = 'PENDING';
