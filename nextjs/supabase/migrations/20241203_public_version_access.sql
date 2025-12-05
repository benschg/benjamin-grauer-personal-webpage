-- Migration to allow public read access to CV versions by ID
-- This enables sharing CV versions via URL with the version UUID
-- Write operations remain restricted to authenticated owners

-- Add policy for public read access
-- Anyone can read versions (needed for sharing via URL)
CREATE POLICY "Anyone can view cv_versions" ON cv_versions
  FOR SELECT USING (true);

-- Drop the old restrictive SELECT policy (we're replacing it with public access)
DROP POLICY IF EXISTS "Users can view own cv_versions" ON cv_versions;

-- Note: The following policies from the original migration remain in place
-- and restrict write operations to authenticated owners:
-- - "Users can insert own cv_versions" (INSERT with auth.uid() = user_id)
-- - "Users can update own cv_versions" (UPDATE with auth.uid() = user_id)
-- - "Users can delete own cv_versions" (DELETE with auth.uid() = user_id)
