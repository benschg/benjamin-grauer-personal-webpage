-- Add display settings columns to cv_share_links
ALTER TABLE cv_share_links
  ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'dark',
  ADD COLUMN IF NOT EXISTS show_photo BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS privacy_level VARCHAR(10) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS show_experience BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_attachments BOOLEAN DEFAULT false;

-- Add public email and address to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS public_email TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS public_address TEXT DEFAULT NULL;
