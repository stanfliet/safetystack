-- Enhanced Schema Migration (007)
-- Run this in Supabase SQL Editor after previous migrations

-- ============================================
-- 0. Ensure project_id column exists on tables
--    that may have been created by prior migrations
--    without this column (CREATE TABLE IF NOT EXISTS
--    skips existing tables).
-- ============================================
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE variations ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS project_id UUID;

-- ============================================
-- 1. BOQ Items schema with safe constraint
-- ============================================
CREATE TABLE IF NOT EXISTS boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_number TEXT,
  description TEXT,
  unit TEXT,
  quantity NUMERIC(12,2),
  rate NUMERIC(12,2),
  amount NUMERIC(14,2),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE boq_items DROP CONSTRAINT IF EXISTS boq_items_project_id_fkey;
ALTER TABLE boq_items ADD CONSTRAINT boq_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_boq_items_project ON boq_items(project_id);

-- ============================================
-- 2. Variations table
-- ============================================
CREATE TABLE IF NOT EXISTS variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  variation_number TEXT,
  description TEXT,
  amount NUMERIC(14,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE variations DROP CONSTRAINT IF EXISTS variations_project_id_fkey;
ALTER TABLE variations ADD CONSTRAINT variations_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_variations_project ON variations(project_id);

-- ============================================
-- 3. HS Files table
-- ============================================
CREATE TABLE IF NOT EXISTS hs_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section TEXT,
  title TEXT,
  content JSONB DEFAULT '{}',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hs_files DROP CONSTRAINT IF EXISTS hs_files_project_id_fkey;
ALTER TABLE hs_files ADD CONSTRAINT hs_files_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_hs_files_project ON hs_files(project_id);

-- ============================================
-- 4. Knowledge base for AI agents (pgvector)
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS knowledge_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- 5. Training bookings table
-- ============================================
CREATE TABLE IF NOT EXISTS training_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_title TEXT,
  course_price NUMERIC(10,2),
  name TEXT,
  company TEXT,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_training_bookings_user ON training_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_training_bookings_status ON training_bookings(status);
ALTER TABLE training_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON training_bookings;
CREATE POLICY "Users can view own bookings" ON training_bookings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own bookings" ON training_bookings;
CREATE POLICY "Users can insert own bookings" ON training_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all bookings" ON training_bookings;
CREATE POLICY "Admins can manage all bookings" ON training_bookings FOR ALL USING (auth.email() = 'hambaniks@gmail.com');

-- ============================================
-- 6. RLS for existing tables (safe re-runs)
-- ============================================
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own boq_items" ON boq_items;
CREATE POLICY "Users can view own boq_items" ON boq_items FOR SELECT USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = boq_items.project_id));
DROP POLICY IF EXISTS "Users can insert own boq_items" ON boq_items;
CREATE POLICY "Users can insert own boq_items" ON boq_items FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own variations" ON variations;
CREATE POLICY "Users can view own variations" ON variations FOR SELECT USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = variations.project_id));
ALTER TABLE hs_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own hs_files" ON hs_files;
CREATE POLICY "Users can view own hs_files" ON hs_files FOR SELECT USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = hs_files.project_id));

-- ============================================
-- 7. Add columns to existing projects table
-- ============================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_contract_value NUMERIC(14,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_project_type TEXT;

-- ============================================
-- 8. Profiles sync trigger (safe re-run)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $BODY$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
