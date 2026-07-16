-- SafetyStack Complete Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (auto-created via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, company_name TEXT, role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  avatar_url TEXT, phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'company_name', COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, client_name TEXT, site_address TEXT,
  project_type TEXT CHECK (project_type IN ('roadworks','housing','civils','building','infrastructure','mining_support','other')),
  cidb_grade TEXT, status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','active','on_hold','completed','closed')),
  start_date DATE, end_date DATE, number_of_workers INTEGER DEFAULT 0, safety_officer TEXT,
  project_manager TEXT, machinery_used TEXT, site_risks TEXT, compliance_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Safety Documents
CREATE TABLE IF NOT EXISTS safety_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, document_type TEXT NOT NULL,
  title TEXT NOT NULL, content TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','expired')),
  version INTEGER DEFAULT 1, generated_by_ai BOOLEAN DEFAULT false, approved_by TEXT, expiry_date DATE, tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE safety_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON safety_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create documents" ON safety_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON safety_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON safety_documents FOR DELETE USING (auth.uid() = user_id);

-- Risk Assessments
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('baseline','task_specific','continuous')),
  title TEXT NOT NULL, activity TEXT, location TEXT, risks JSONB DEFAULT '[]', control_measures TEXT,
  ppe_required TEXT, residual_risk TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','reviewed','approved')),
  reviewed_by TEXT, review_date DATE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own risk assessments" ON risk_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create risk assessments" ON risk_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own risk assessments" ON risk_assessments FOR UPDATE USING (auth.uid() = user_id);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, inspection_type TEXT NOT NULL,
  title TEXT NOT NULL, checklist_items JSONB DEFAULT '[]', overall_score DECIMAL(5,2),
  findings TEXT, corrective_actions TEXT, inspector_name TEXT, scheduled_date DATE, completed_date DATE,
  signature_url TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_progress','completed','requires_action')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own inspections" ON inspections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create inspections" ON inspections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inspections" ON inspections FOR UPDATE USING (auth.uid() = user_id);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported','under_investigation','corrective_action','closed')),
  title TEXT NOT NULL, description TEXT, incident_date TIMESTAMPTZ, location TEXT, injured_person_name TEXT,
  witnesses TEXT, root_cause TEXT, corrective_actions TEXT, dol_reportable BOOLEAN DEFAULT false,
  dol_report_number TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own incidents" ON incidents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create incidents" ON incidents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own incidents" ON incidents FOR UPDATE USING (auth.uid() = user_id);

-- Workers
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, first_name TEXT NOT NULL,
  last_name TEXT NOT NULL, id_number TEXT, role TEXT NOT NULL, trade TEXT, contact_number TEXT,
  emergency_contact TEXT, induction_status BOOLEAN DEFAULT false, induction_date DATE,
  certifications JSONB DEFAULT '[]', medical_fitness BOOLEAN DEFAULT false, medical_expiry DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own workers" ON workers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workers" ON workers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workers" ON workers FOR UPDATE USING (auth.uid() = user_id);

-- Tender Documents
CREATE TABLE IF NOT EXISTS tender_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, tender_type TEXT NOT NULL,
  contract_type TEXT, title TEXT NOT NULL, content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','submitted','awarded','rejected','closed')),
  tender_value DECIMAL(15,2), client_name TEXT, submission_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tender_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tender documents" ON tender_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tender documents" ON tender_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tender documents" ON tender_documents FOR UPDATE USING (auth.uid() = user_id);

-- Pricing Items
CREATE TABLE IF NOT EXISTS pricing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('materials','plant','labour')), group_name TEXT, code TEXT,
  description TEXT NOT NULL, unit TEXT, supply_rate DECIMAL(12,2), install_rate DECIMAL(12,2),
  total_rate DECIMAL(12,2), region TEXT DEFAULT 'national', source TEXT, effective_date DATE, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE pricing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pricing items" ON pricing_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create pricing items" ON pricing_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pricing items" ON pricing_items FOR UPDATE USING (auth.uid() = user_id);

-- Compliance Actions
CREATE TABLE IF NOT EXISTS compliance_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, title TEXT NOT NULL,
  action_type TEXT, description TEXT, priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','overdue')),
  due_date DATE, assigned_to TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE compliance_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own compliance actions" ON compliance_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create compliance actions" ON compliance_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own compliance actions" ON compliance_actions FOR UPDATE USING (auth.uid() = user_id);

-- Agent Conversations
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL, title TEXT, messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON agent_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON agent_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON agent_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('starter','professional','enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','incomplete')),
  stripe_customer_id TEXT, stripe_subscription_id TEXT, current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ, billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly','annually')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Contractor Onboardings
CREATE TABLE IF NOT EXISTS contractor_onboardings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL, registration_number TEXT, cidb_grade TEXT, bbeee_level TEXT,
  tax_clearance_url TEXT, good_standing_url TEXT, insurance_url TEXT, safety_file_url TEXT,
  designated_safety_officer TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','under_review','approved','rejected')),
  step INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contractor_onboardings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own onboarding" ON contractor_onboardings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create onboarding" ON contractor_onboardings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON contractor_onboardings FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_documents_project ON safety_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_project ON risk_assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_inspections_project ON inspections(project_id);
CREATE INDEX IF NOT EXISTS idx_incidents_project ON incidents(project_id);
CREATE INDEX IF NOT EXISTS idx_workers_project ON workers(project_id);
CREATE INDEX IF NOT EXISTS idx_tender_documents_user ON tender_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_items_category ON pricing_items(category);
CREATE INDEX IF NOT EXISTS idx_compliance_actions_project ON compliance_actions(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
