-- SafetyStack Enhanced Schema - Intelligent Document Processing, Commercial Management, Intelligence

-- ============================================
-- DOCUMENTS (Uploaded files with analysis)
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded','processing','analyzed','failed')),
  text_content TEXT,
  analysis JSONB DEFAULT '{}',
  analysis_summary TEXT,
  extracted_risks JSONB DEFAULT '[]',
  extracted_requirements JSONB DEFAULT '[]',
  extracted_timeline TEXT,
  extracted_scope TEXT,
  extracted_contractor TEXT,
  ocr_used BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- BOQ / COMMERCIAL ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS boq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_number TEXT,
  description TEXT NOT NULL,
  unit TEXT,
  quantity DECIMAL(15,2) DEFAULT 0,
  rate DECIMAL(15,2) DEFAULT 0,
  amount DECIMAL(15,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  category TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','variation','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own boq" ON boq_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create boq" ON boq_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own boq" ON boq_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own boq" ON boq_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VARIATIONS / CHANGE ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variation_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  change_type TEXT CHECK (change_type IN ('addition','deletion','substitution','omission')),
  reason TEXT,
  original_value DECIMAL(15,2) DEFAULT 0,
  variation_value DECIMAL(15,2) DEFAULT 0,
  net_change DECIMAL(15,2) GENERATED ALWAYS AS (variation_value - original_value) STORED,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected','implemented')),
  approved_by TEXT,
  approval_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own variations" ON variations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create variations" ON variations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own variations" ON variations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own variations" ON variations FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INTELLIGENCE INSIGHTS
-- ============================================
CREATE TABLE IF NOT EXISTS intelligence_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('risk','compliance','schedule','cost','safety','commercial')),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('info','warning','critical')),
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE intelligence_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insights" ON intelligence_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create insights" ON intelligence_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON intelligence_insights FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ACTIVITY LOG (Audit Trail)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_items_project ON boq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_variations_project ON variations(project_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_insights_project ON intelligence_insights(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON activity_logs(project_id);
