-- Share Links table - stores shortened URLs for CV sharing with tracking
CREATE TABLE IF NOT EXISTS cv_share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code VARCHAR(8) NOT NULL UNIQUE,
  cv_version_id UUID REFERENCES cv_versions(id) ON DELETE SET NULL,
  full_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Share Link Visits table - tracks visits to shared links
CREATE TABLE IF NOT EXISTS cv_share_link_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_link_id UUID NOT NULL REFERENCES cv_share_links(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash VARCHAR(64), -- SHA-256 hash of IP for privacy-friendly unique visitor counting
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security
ALTER TABLE cv_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_share_link_visits ENABLE ROW LEVEL SECURITY;

-- Policies for cv_share_links
-- Anyone can read share links (needed for redirect)
CREATE POLICY "Anyone can view share links" ON cv_share_links
  FOR SELECT USING (true);

-- Only authenticated users can create share links
CREATE POLICY "Authenticated users can create share links" ON cv_share_links
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can delete their own share links
CREATE POLICY "Users can delete own share links" ON cv_share_links
  FOR DELETE USING (auth.uid() = created_by);

-- Policies for cv_share_link_visits
-- Anyone can insert visits (for tracking)
CREATE POLICY "Anyone can insert visits" ON cv_share_link_visits
  FOR INSERT WITH CHECK (true);

-- Only the link creator can view visit stats
CREATE POLICY "Link creators can view visit stats" ON cv_share_link_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cv_share_links
      WHERE cv_share_links.id = cv_share_link_visits.share_link_id
      AND cv_share_links.created_by = auth.uid()
    )
  );

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_share_links_short_code ON cv_share_links(short_code);
CREATE INDEX IF NOT EXISTS idx_share_links_created_by ON cv_share_links(created_by);
CREATE INDEX IF NOT EXISTS idx_share_link_visits_link_id ON cv_share_link_visits(share_link_id);
CREATE INDEX IF NOT EXISTS idx_share_link_visits_visited_at ON cv_share_link_visits(visited_at);
