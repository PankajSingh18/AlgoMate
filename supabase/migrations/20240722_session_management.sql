-- supabase/migrations/20240722_session_management.sql

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspicious')),
  used_at TIMESTAMPTZ,
  used_ip TEXT,
  used_device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  INDEX idx_refresh_tokens_token (token),
  INDEX idx_refresh_tokens_user_id (user_id),
  INDEX idx_refresh_tokens_family_id (family_id)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_id UUID REFERENCES refresh_tokens(id),
  device_hash TEXT NOT NULL,
  device_info JSONB,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspicious')),
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  INDEX idx_sessions_user_id (user_id),
  INDEX idx_sessions_device_hash (device_hash),
  INDEX idx_sessions_status (status)
);

-- Create token_rotation_logs table
CREATE TABLE IF NOT EXISTS token_rotation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  device_hash TEXT,
  rotated_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_token_rotation_logs_user_id (user_id),
  INDEX idx_token_rotation_logs_family_id (family_id)
);

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  INDEX idx_security_events_user_id (user_id),
  INDEX idx_security_events_created_at (created_at)
);

-- Create login_alerts table
CREATE TABLE IF NOT EXISTS login_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  device_info JSONB,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  INDEX idx_login_alerts_user_id (user_id),
  INDEX idx_login_alerts_created_at (created_at)
);

-- RLS Policies
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_rotation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY refresh_tokens_user_policy ON refresh_tokens
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY sessions_user_policy ON sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY login_alerts_user_policy ON login_alerts
  FOR ALL USING (user_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS VOID AS $$
BEGIN
  UPDATE refresh_tokens
  SET status = 'expired'
  WHERE expires_at < NOW()
  AND status = 'active';
END;
$$ LANGUAGE plpgsql;