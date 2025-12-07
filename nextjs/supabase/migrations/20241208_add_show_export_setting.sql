-- Add show_export column to cv_share_links
ALTER TABLE cv_share_links
  ADD COLUMN IF NOT EXISTS show_export BOOLEAN DEFAULT true;
