-- CV Versions table - stores different CV versions per user
CREATE TABLE IF NOT EXISTS cv_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  job_context TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Styles table - stores CV styling configurations
CREATE TABLE IF NOT EXISTS cv_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_styles ENABLE ROW LEVEL SECURITY;

-- Policies for cv_versions
-- Users can only see their own CV versions
CREATE POLICY "Users can view own cv_versions" ON cv_versions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own CV versions
CREATE POLICY "Users can insert own cv_versions" ON cv_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own CV versions
CREATE POLICY "Users can update own cv_versions" ON cv_versions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own CV versions
CREATE POLICY "Users can delete own cv_versions" ON cv_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for cv_styles
-- Everyone can view styles (they're shared/global)
CREATE POLICY "Anyone can view cv_styles" ON cv_styles
  FOR SELECT USING (true);

-- Only authenticated users can insert styles (or restrict to admin)
CREATE POLICY "Authenticated users can insert cv_styles" ON cv_styles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cv_versions_user_id ON cv_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_versions_is_default ON cv_versions(user_id, is_default);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_cv_versions_updated_at
  BEFORE UPDATE ON cv_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default CV styles
INSERT INTO cv_styles (name, config) VALUES
  ('Classic', '{"fontFamily": "Times New Roman", "fontSize": "12pt", "accentColor": "#2c3e50", "layout": "classic"}'),
  ('Modern', '{"fontFamily": "Arial", "fontSize": "11pt", "accentColor": "#3498db", "layout": "modern"}'),
  ('Minimal', '{"fontFamily": "Helvetica", "fontSize": "11pt", "accentColor": "#333333", "layout": "minimal"}')
ON CONFLICT DO NOTHING;
