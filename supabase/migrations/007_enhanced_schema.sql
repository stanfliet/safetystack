-- 007 Enhanced Schema: Storage buckets, improved tables, RLS policies

-- ==================== STORAGE BUCKETS ====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', true, 104857600, '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/gif,image/webp,text/plain,text/csv,application/json,text/html}'),
  ('hs-files', 'hs-files', true, 52428800, '{text/html,application/pdf}'),
  ('company-logos', 'company-logos', true, 5242880, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO NOTHING;

-- ==================== ENHANCED DOCUMENTS TABLE ====================
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_analysis JSONB DEFAULT '{}';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending','processing','completed','failed'));
ALTER TABLE documents ADD COLUMN IF NOT EXISTS generated_from_doc_id UUID REFERENCES documents(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- ==================== ENHANCED HS_FILES TABLE ====================
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS site_address TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS scope_of_works TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS principal_contractor TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS safety_officer TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS number_of_workers INTEGER;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS project_duration TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS document_index JSONB DEFAULT '[]';
ALTER TABLE hs_files ADD COLUMN IF NOT EXISTS generated_by TEXT DEFAULT 'ai';

-- ==================== BOQ ITEMS ENHANCED ====================
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS rate_build_up JSONB DEFAULT '{}';
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS total_direct_cost DECIMAL(15,2);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS p_and_g_amount DECIMAL(15,2);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS overheads_and_profit_amount DECIMAL(15,2);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS contingency_amount DECIMAL(15,2);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS source_document_id UUID REFERENCES documents(id);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS pricing_status TEXT DEFAULT 'manual' CHECK (pricing_status IN ('manual','ai_priced','reviewed','approved'));

-- ==================== CONVERSATIONS TABLE ====================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  agent_id TEXT NOT NULL,
  title TEXT DEFAULT 'New conversation',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- ==================== COMPANY PROFILES ====================
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT,
  registration_number TEXT,
  tax_number TEXT,
  cidb_grade TEXT,
  cidb_classification TEXT[] DEFAULT '{}',
  bbbee_level TEXT,
  address TEXT,
  postal_address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  safety_officer_name TEXT,
  safety_officer_registration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their company profile" ON company_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ==================== KNOWLEDGE SEARCH LOG ====================
CREATE TABLE IF NOT EXISTS knowledge_search_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  category TEXT,
  results_count INTEGER DEFAULT 0,
  method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE knowledge_search_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their search history" ON knowledge_search_log
  FOR SELECT USING (auth.uid() = user_id);

-- ==================== STORAGE RLS POLICIES ====================
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('documents', 'hs-files', 'company-logos')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can read documents" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('documents', 'hs-files', 'company-logos')
    AND (auth.role() = 'authenticated' OR bucket_id IN ('documents', 'company-logos'))
  );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_documents_user_project ON documents(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_documents_analysis_status ON documents(analysis_status);
CREATE INDEX IF NOT EXISTS idx_hs_files_user_id ON hs_files(user_id);
CREATE INDEX IF NOT EXISTS idx_boq_items_project ON boq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent ON conversations(agent_id);
