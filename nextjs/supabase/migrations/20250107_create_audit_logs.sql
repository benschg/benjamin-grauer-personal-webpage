-- Audit logs table for tracking admin operations
-- This provides accountability and helps detect unauthorized changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_email VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
  resource_type VARCHAR(50) NOT NULL, -- whitelisted_emails, site_settings, cv_references, share_links
  resource_id UUID,
  details JSONB, -- Additional details about the change
  ip_address VARCHAR(45), -- Supports IPv6
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can insert (used by API routes)
CREATE POLICY "Service role can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Only admin can read audit logs
CREATE POLICY "Admin can view audit logs" ON audit_logs
  FOR SELECT USING (true);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
