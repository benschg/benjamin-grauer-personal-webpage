-- CV References table - stores professional references for CV
CREATE TABLE IF NOT EXISTS cv_references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cv_references ENABLE ROW LEVEL SECURITY;

-- Anyone can read references (they appear on public CV)
CREATE POLICY "Anyone can view active references" ON cv_references
  FOR SELECT USING (is_active = true);

-- Only authenticated admin can manage references
CREATE POLICY "Authenticated users can insert references" ON cv_references
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update references" ON cv_references
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete references" ON cv_references
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at
CREATE TRIGGER update_cv_references_updated_at
  BEFORE UPDATE ON cv_references
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Initial references inserted manually via Supabase dashboard (not in migration for privacy)
