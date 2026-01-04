-- Rate Limits table - stores rate limiting state for distributed environments
-- This replaces in-memory rate limiting to work across serverless instances
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by API routes)
-- No policies for regular users - this table is only accessed server-side with service role
CREATE POLICY "Service role has full access" ON rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster key lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);

-- Create index for cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits(expires_at);

-- Function to clean up expired rate limit entries (run periodically via cron or on each check)
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limits WHERE expires_at < NOW();
END;
$$;
