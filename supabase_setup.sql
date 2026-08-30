-- Add joined_community column to user_profiles for Join Community Button
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS joined_community BOOLEAN DEFAULT false;

-- ── user_activity ──────────────────────────────────────────────────────
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity" ON user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON user_activity
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── problem_bookmarks ──────────────────────────────────────────────────
ALTER TABLE problem_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks" ON problem_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON problem_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON problem_bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON problem_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── user_progress ──────────────────────────────────────────────────────
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── user_profiles ──────────────────────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── community_contributors (already has SELECT for public) ──────────────
ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON community_contributors
  FOR SELECT
  USING (true);

-- Admin users can manage contributors (requires a custom claim or user_metadata)
CREATE POLICY "Admins can insert contributors" ON community_contributors
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update contributors" ON community_contributors
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete contributors" ON community_contributors
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ====================================================================
-- pending_messages table for SMTP quota fallback
-- ====================================================================
CREATE TABLE IF NOT EXISTS pending_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'review')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ
);

-- Add for deployments created before claimed_at existed.
ALTER TABLE pending_messages ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

ALTER TABLE pending_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert pending_messages" ON pending_messages
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can read pending_messages" ON pending_messages
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update pending_messages" ON pending_messages
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ====================================================================
-- Atomic claim for the delayed-email cron job.
-- Marks a batch of unsent rows as claimed (claimed_at = now()) in a single
-- UPDATE ... RETURNING with FOR UPDATE SKIP LOCKED, so overlapping cron
-- runs never claim the same row and never double-send a message.
-- Rows claimed more than 5 minutes ago (e.g. a crashed run) are reclaimed
-- so messages are not lost.
-- ====================================================================
CREATE OR REPLACE FUNCTION claim_pending_messages(p_limit INTEGER DEFAULT 50)
RETURNS SETOF pending_messages
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE pending_messages
  SET claimed_at = now()
  WHERE id IN (
    SELECT id
    FROM pending_messages
    WHERE sent_at IS NULL
      AND (claimed_at IS NULL OR claimed_at < now() - interval '5 minutes')
    ORDER BY created_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

-- ====================================================================
-- newsletter_subscriptions table for Footer Newsletter
-- ====================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active'
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- topic_comments table for visualizer discussion threads
-- ====================================================================
CREATE TABLE topic_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE topic_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON topic_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON topic_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Atomic streak increment function (fixes TOCTOU race condition)
-- ====================================================================
CREATE OR REPLACE FUNCTION increment_streak_on_completion(p_user_id UUID, p_local_date DATE DEFAULT NULL)
RETURNS TABLE (current_streak INT, longest_streak INT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_current INT;
  v_longest INT;
  v_last_active DATE;
  v_today DATE := COALESCE(p_local_date, CURRENT_DATE);
  v_yesterday DATE := COALESCE(p_local_date, CURRENT_DATE) - 1;
BEGIN
  -- Try to select and lock the existing row
  SELECT user_practice_stats.current_streak, user_practice_stats.longest_streak, user_practice_stats.last_active_date::DATE
  INTO v_current, v_longest, v_last_active
  FROM user_practice_stats
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- If not found, attempt to insert a new row
  IF NOT FOUND THEN
    BEGIN
      INSERT INTO user_practice_stats (user_id, current_streak, longest_streak, last_active_date, visualized_count)
      VALUES (p_user_id, 1, 1, v_today, 0)
      RETURNING user_practice_stats.current_streak, user_practice_stats.longest_streak INTO v_current, v_longest;
      RETURN QUERY SELECT v_current, v_longest;
      RETURN;
    EXCEPTION WHEN unique_violation THEN
      -- If a concurrent insert succeeded, lock and select the newly inserted row
      SELECT user_practice_stats.current_streak, user_practice_stats.longest_streak, user_practice_stats.last_active_date::DATE
      INTO v_current, v_longest, v_last_active
      FROM user_practice_stats
      WHERE user_id = p_user_id
      FOR UPDATE;
    END;
  END IF;

  IF v_last_active > v_today THEN
    -- Out of order update (e.g., solving problem for a past day after solving one for today/future)
    -- Do not reset or modify current_streak, longest_streak, or last_active_date.
    RETURN QUERY SELECT v_current, v_longest;
    RETURN;
  ELSIF v_last_active = v_yesterday THEN
    v_current := v_current + 1;
    IF v_current > v_longest THEN
      v_longest := v_current;
    END IF;
  ELSIF v_last_active IS NULL OR v_last_active < v_yesterday THEN
    v_current := 1;
  END IF;

  UPDATE user_practice_stats
  SET current_streak = v_current, longest_streak = v_longest, last_active_date = v_today
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_current, v_longest;
END;
$$;

-- ====================================================================
-- Combined function: upsert progress and update streak atomically
-- Wraps both operations in a single transaction to prevent partial failures
-- ====================================================================
CREATE OR REPLACE FUNCTION upsert_progress_and_update_streak(
  p_user_id UUID,
  p_problem_id TEXT,
  p_status TEXT,
  p_updated_at TIMESTAMPTZ
)
RETURNS TABLE (current_streak INT, longest_streak INT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing_status TEXT;
  v_current INT;
  v_longest INT;
  v_last_active DATE;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - 1;
BEGIN
  -- Get existing progress status
  SELECT status INTO v_existing_status
  FROM user_progress
  WHERE user_id = p_user_id AND problem_id = p_problem_id;

  -- Upsert progress
  INSERT INTO user_progress (user_id, problem_id, status, updated_at)
  VALUES (p_user_id, p_problem_id, p_status, p_updated_at)
  ON CONFLICT (user_id, problem_id)
  DO UPDATE SET status = p_status, updated_at = p_updated_at;

  -- Only update streak if completed now AND was NOT completed before
  IF p_status = 'Completed' AND COALESCE(v_existing_status, '') <> 'Completed' THEN
    SELECT current_streak, longest_streak, last_active_date::DATE
    INTO v_current, v_longest, v_last_active
    FROM user_practice_stats
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
      INSERT INTO user_practice_stats (user_id, current_streak, longest_streak, last_active_date, visualized_count)
      VALUES (p_user_id, 1, 1, v_today, 0)
      RETURNING current_streak, longest_streak INTO v_current, v_longest;
      RETURN QUERY SELECT v_current, v_longest;
      RETURN;
    END IF;

    IF v_last_active > v_today THEN
      -- Out of order update (do not modify streak)
      RETURN QUERY SELECT v_current, v_longest;
      RETURN;
    ELSIF v_last_active = v_yesterday THEN
      v_current := v_current + 1;
      IF v_current > v_longest THEN
        v_longest := v_current;
      END IF;
    ELSIF v_last_active IS NULL OR v_last_active < v_yesterday THEN
      v_current := 1;
    END IF;

    UPDATE user_practice_stats
    SET current_streak = v_current, longest_streak = v_longest, last_active_date = v_today
    WHERE user_id = p_user_id;
  ELSE
    -- If it is already completed, or is not completed, we just get existing values
    SELECT current_streak, longest_streak
    INTO v_current, v_longest
    FROM user_practice_stats
    WHERE user_id = p_user_id;
  END IF;

  RETURN QUERY SELECT COALESCE(v_current, 0), COALESCE(v_longest, 0);
END;
$$;
