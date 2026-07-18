-- 007 Enhanced Schema (RAG, RBAC, Pricing, Contracts, BOQ, Tenders)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('super_admin','company_admin','hs_manager','safety_officer','quantity_surveyor','project_manager','employee','client');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_standard') THEN
    CREATE TYPE contract_standard AS ENUM ('gcc2010','gcc2015','fidic','nec3','nec4','jbcc');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS company_profiles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL,registration_number TEXT,tax_id TEXT,address TEXT,phone TEXT,email TEXT,logo_url TEXT,is_active BOOLEAN DEFAULT true,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'employee';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES company_profiles(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions JSONB;

CREATE TABLE IF NOT EXISTS knowledge_categories (id TEXT PRIMARY KEY,name TEXT NOT NULL,description TEXT,parent_category TEXT,icon TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS knowledge_documents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),category TEXT NOT NULL,subcategory TEXT,title TEXT NOT NULL,content TEXT NOT NULL,source TEXT,source_url TEXT,file_path TEXT,metadata JSONB,is_active BOOLEAN DEFAULT true,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS document_chunks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,chunk_index INTEGER NOT NULL,content TEXT NOT NULL,chunk_hash TEXT UNIQUE,metadata JSONB,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS embeddings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),chunk_id UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,embedding VECTOR(1536),model TEXT DEFAULT 'text-embedding-3-small',created_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS material_prices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),material_code TEXT NOT NULL,material_name TEXT NOT NULL,description TEXT,unit TEXT NOT NULL,base_price DECIMAL(12,4) NOT NULL,supplier TEXT,region TEXT,effective_date DATE,expiry_date DATE,metadata JSONB,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS labour_rates (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),labour_code TEXT NOT NULL,labour_type TEXT NOT NULL,description TEXT,daily_rate DECIMAL(12,4) NOT NULL,hourly_rate DECIMAL(12,4),region TEXT,effective_date DATE,expiry_date DATE,metadata JSONB,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS plant_rates (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),plant_code TEXT NOT NULL,plant_name TEXT NOT NULL,description TEXT,daily_rental_rate DECIMAL(12,4),hourly_rental_rate DECIMAL(12,4),monthly_rental_rate DECIMAL(12,4),operator_included BOOLEAN DEFAULT false,fuel_included BOOLEAN DEFAULT false,region TEXT,effective_date DATE,expiry_date DATE,metadata JSONB,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS boq_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,boq_reference TEXT UNIQUE NOT NULL,title TEXT NOT NULL,description TEXT,total_value DECIMAL(15,2),currency TEXT DEFAULT 'ZAR',status TEXT DEFAULT 'draft',version INTEGER DEFAULT 1,created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boq_id UUID NOT NULL REFERENCES boq_records(id) ON DELETE CASCADE,
  item_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  specification TEXT,
  unit TEXT NOT NULL,
  quantity DECIMAL(15,4) NOT NULL,
  unit_rate DECIMAL(15,4) NOT NULL,
  total_amount DECIMAL(15,4),
  materials_cost DECIMAL(15,4),
  labour_cost DECIMAL(15,4),
  plant_cost DECIMAL(15,4),
  equipment_cost DECIMAL(15,4),
  transport_cost DECIMAL(15,4),
  markup_percentage DECIMAL(5,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Handle existing boq_items from prior migrations (001, 002, 007) that lack these columns
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS boq_id UUID REFERENCES boq_records(id) ON DELETE CASCADE;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS specification TEXT;
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS unit_rate DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS total_amount DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS materials_cost DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS labour_cost DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS plant_cost DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS equipment_cost DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS transport_cost DECIMAL(15,4);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS markup_percentage DECIMAL(5,2);
ALTER TABLE boq_items ADD COLUMN IF NOT EXISTS metadata JSONB;
-- Note: old columns (project_id, user_id, rate, amount, category, notes, status) from prior migrations
-- remain in place for backward compatibility with existing queries
CREATE TABLE IF NOT EXISTS rate_buildups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),boq_item_id UUID NOT NULL REFERENCES boq_items(id) ON DELETE CASCADE,material_quantity DECIMAL(15,4),material_code TEXT,material_unit_price DECIMAL(15,4),material_total DECIMAL(15,4),labour_hours DECIMAL(15,2),labour_code TEXT,labour_unit_rate DECIMAL(15,4),labour_total DECIMAL(15,4),plant_hours DECIMAL(15,2),plant_code TEXT,plant_unit_rate DECIMAL(15,4),plant_total DECIMAL(15,4),created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS tender_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,tender_reference TEXT UNIQUE NOT NULL,tender_name TEXT NOT NULL,description TEXT,client_name TEXT,tender_value DECIMAL(15,2),closing_date DATE,opening_date DATE,status TEXT DEFAULT 'preparation',document_path TEXT,evaluation_criteria JSONB,created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS tender_methodologies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),tender_id UUID NOT NULL REFERENCES tender_records(id) ON DELETE CASCADE,methodology_type TEXT NOT NULL,content TEXT,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS tender_programmes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),tender_id UUID NOT NULL REFERENCES tender_records(id) ON DELETE CASCADE,programme_name TEXT,duration_days INTEGER,start_date DATE,end_date DATE,content TEXT,created_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS contract_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,contract_standard TEXT NOT NULL,contract_number TEXT UNIQUE NOT NULL,contract_value DECIMAL(15,2) NOT NULL,contract_name TEXT NOT NULL,client_name TEXT,contractor_name TEXT,start_date DATE,end_date DATE,status TEXT DEFAULT 'active',document_path TEXT,created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS contract_variations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,variation_number INTEGER NOT NULL,variation_date DATE NOT NULL,description TEXT NOT NULL,original_amount DECIMAL(15,2),variation_amount DECIMAL(15,2),new_total_amount DECIMAL(15,2),status TEXT DEFAULT 'pending',approved_by UUID REFERENCES auth.users(id),approval_date TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS contract_claims (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,claim_date DATE NOT NULL,claim_type TEXT NOT NULL,description TEXT NOT NULL,claim_amount DECIMAL(15,2),supporting_documents TEXT,status TEXT DEFAULT 'submitted',response_date DATE,response_comments TEXT,created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS early_warnings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,warning_date DATE NOT NULL,warning_description TEXT NOT NULL,risk_assessment TEXT,mitigation_plan TEXT,status TEXT DEFAULT 'active',created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS compensation_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,event_date DATE NOT NULL,event_description TEXT NOT NULL,financial_impact DECIMAL(15,2),time_impact_days INTEGER,status TEXT DEFAULT 'submitted',created_by UUID NOT NULL REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS payment_certificates (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,certificate_number TEXT UNIQUE NOT NULL,certificate_date DATE NOT NULL,period_start_date DATE,period_end_date DATE,work_completed DECIMAL(12,2),retention_percentage DECIMAL(5,2),certified_amount DECIMAL(15,2),status TEXT DEFAULT 'draft',approved_by UUID REFERENCES auth.users(id),created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS defects_lists (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),contract_id UUID NOT NULL REFERENCES contract_records(id) ON DELETE CASCADE,list_date DATE NOT NULL,defect_description TEXT NOT NULL,location TEXT,severity TEXT,remedial_action TEXT,status TEXT DEFAULT 'open',rectification_date DATE,created_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS generated_documents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID REFERENCES projects(id) ON DELETE CASCADE,user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,title TEXT NOT NULL,document_type TEXT NOT NULL,content TEXT,status TEXT DEFAULT 'draft',version INTEGER DEFAULT 1,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS digital_signatures (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,signatory_id UUID NOT NULL REFERENCES auth.users(id),signatory_name TEXT NOT NULL,signatory_title TEXT,signature_date TIMESTAMPTZ NOT NULL,signature_hash TEXT,signature_metadata JSONB,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS document_qr_codes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,qr_code_data TEXT,verification_token TEXT UNIQUE,verified_count INTEGER DEFAULT 0,last_verified_at TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT NOW());

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE labour_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_buildups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_methodologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compensation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_qr_codes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_category ON knowledge_documents(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_is_active ON knowledge_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_chunk_id ON embeddings(chunk_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_document_id ON embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_material_prices_code ON material_prices(material_code);
CREATE INDEX IF NOT EXISTS idx_labour_rates_code ON labour_rates(labour_code);
CREATE INDEX IF NOT EXISTS idx_plant_rates_code ON plant_rates(plant_code);
CREATE INDEX IF NOT EXISTS idx_tender_records_project_id ON tender_records(project_id);
CREATE INDEX IF NOT EXISTS idx_contract_records_project_id ON contract_records(project_id);
CREATE INDEX IF NOT EXISTS idx_contract_variations_contract_id ON contract_variations(contract_id);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_document_id ON digital_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_qr_codes_document_id ON document_qr_codes(document_id);
CREATE INDEX IF NOT EXISTS idx_boq_records_project_id ON boq_records(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_items_boq_id ON boq_items(boq_id);

CREATE POLICY "Users can read company_profiles" ON company_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read knowledge_documents" ON knowledge_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert knowledge_documents" ON knowledge_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read document_chunks" ON document_chunks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read embeddings" ON embeddings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read knowledge_categories" ON knowledge_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read material_prices" ON material_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read labour_rates" ON labour_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read plant_rates" ON plant_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read boq_records" ON boq_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read boq_items" ON boq_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read rate_buildups" ON rate_buildups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read tender_records" ON tender_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert tender_records" ON tender_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read contract_records" ON contract_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert contract_records" ON contract_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read contract_variations" ON contract_variations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read contract_claims" ON contract_claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read early_warnings" ON early_warnings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read compensation_events" ON compensation_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read payment_certificates" ON payment_certificates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read defects_lists" ON defects_lists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read generated_documents" ON generated_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert generated_documents" ON generated_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read digital_signatures" ON digital_signatures FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read document_qr_codes" ON document_qr_codes FOR SELECT TO authenticated USING (true);