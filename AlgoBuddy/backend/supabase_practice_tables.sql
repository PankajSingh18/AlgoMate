-- Create user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Create user_practice_stats table
CREATE TABLE user_practice_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    visualized_count INTEGER DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for user_practice_stats
CREATE POLICY "Users can view their own stats" 
ON user_practice_stats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON user_practice_stats FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON user_practice_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create problem_bookmarks table
CREATE TABLE problem_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    topic_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Enable RLS and Policies for problem_bookmarks
ALTER TABLE problem_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" 
ON problem_bookmarks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
ON problem_bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON problem_bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- ─── My Sheet table ──────────────────────────────────────────────────────────
-- Stores user-curated personal problem lists (distinct from bookmarks)
CREATE TABLE IF NOT EXISTS my_sheet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    note TEXT DEFAULT '',
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE my_sheet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sheet"
ON my_sheet FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own sheet"
ON my_sheet FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sheet"
ON my_sheet FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own sheet"
ON my_sheet FOR DELETE
USING (auth.uid() = user_id);

-- ─── Arena: user_arena_profiles ──────────────────────────────────────────────

-- Enable RLS
ALTER TABLE user_arena_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (needed for leaderboard)
CREATE POLICY "Anyone can view arena profiles"
ON user_arena_profiles FOR SELECT
USING (true);

-- Users can insert their own profile (first-time setup)
CREATE POLICY "Users can insert their own arena profile"
ON user_arena_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own arena profile"
ON user_arena_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ─── Arena: arena_matches ────────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE arena_matches ENABLE ROW LEVEL SECURITY;

-- Players can view matches they participated in
CREATE POLICY "Players can view their own matches"
ON arena_matches FOR SELECT
USING (
    auth.uid() = player1_id
    OR auth.uid() = player2_id
);

-- Only the service role (backend) may insert/update/delete matches.
-- Authenticated users have no direct write access — all writes go through
-- the Spring Boot service which connects as the service role.
-- (No INSERT / UPDATE / DELETE policies = blocked for anon + authenticated roles)


-- ─── notifications ────────────────────────────────────────────────────────────
-- Stores in-app notifications for users (e.g., job application status updates)

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID,
    message TEXT NOT NULL DEFAULT '',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Users can mark their own notifications as read"
ON notifications FOR UPDATE
USING (auth.uid() = student_id);

-- Service role inserts notifications (no INSERT policy for authenticated users)
