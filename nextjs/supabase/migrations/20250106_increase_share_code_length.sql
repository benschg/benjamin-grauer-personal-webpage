-- Increase share code length from 8 to 16 characters for better security
-- This makes brute-force enumeration of share links practically impossible
-- 36^16 ≈ 7.9 × 10^24 combinations vs 36^8 ≈ 2.8 × 10^12

ALTER TABLE cv_share_links
  ALTER COLUMN short_code TYPE VARCHAR(16);
