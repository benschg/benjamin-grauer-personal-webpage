-- Add show_export column to cv_share_links
-- Default is false (export panel closed by default)
ALTER TABLE cv_share_links
  ADD COLUMN IF NOT EXISTS show_export BOOLEAN DEFAULT false;
