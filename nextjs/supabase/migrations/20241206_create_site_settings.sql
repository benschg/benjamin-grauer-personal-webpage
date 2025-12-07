-- Site Settings table - stores site configuration in a single row
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures only one row
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_address TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Whitelisted Emails table - stores emails allowed to view private CV info
CREATE TABLE IF NOT EXISTS whitelisted_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT, -- Optional display name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitelisted_emails ENABLE ROW LEVEL SECURITY;

-- Site Settings policies
CREATE POLICY "Anyone can view settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Whitelisted Emails policies
CREATE POLICY "Anyone can view whitelisted emails" ON whitelisted_emails
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert whitelisted emails" ON whitelisted_emails
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete whitelisted emails" ON whitelisted_emails
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert the single settings row
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
