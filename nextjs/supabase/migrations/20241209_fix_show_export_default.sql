-- Fix show_export default to false
-- The original migration (20241208) set default to true, but it should be false
-- (export panel should be closed by default)
ALTER TABLE cv_share_links
  ALTER COLUMN show_export SET DEFAULT false;
