-- H&S Files table
CREATE TABLE IF NOT EXISTS hs_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional H&S documents
CREATE TABLE IF NOT EXISTS hs_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  section TEXT,
  file_type TEXT,
  original_name TEXT,
  file_size BIGINT,
  text_content TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  generated_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOQ items enhanced
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS existing_rate NUMERIC;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS rate_breakdown JSONB;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS priced_by_ai BOOLEAN DEFAULT false;

-- RLS
ALTER TABLE hs_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own HS files" ON hs_files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own HS documents" ON hs_documents FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hs_files_user ON hs_files(user_id);
CREATE INDEX IF NOT EXISTS idx_hs_files_project ON hs_files(project_id);
CREATE INDEX IF NOT EXISTS idx_hs_documents_project ON hs_documents(project_id);
