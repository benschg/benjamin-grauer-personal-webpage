-- Security fix: Restrict whitelisted_emails SELECT to authenticated users only
-- Previously anyone could view the whitelist, exposing privileged user emails
-- This could be used for phishing attacks targeting those users

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view whitelisted emails" ON whitelisted_emails;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view whitelisted emails" ON whitelisted_emails
  FOR SELECT USING (auth.role() = 'authenticated');
