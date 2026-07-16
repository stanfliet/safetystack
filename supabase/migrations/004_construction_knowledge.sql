-- ============================================================
-- SafetyStack Multidisciplinary Construction Knowledge Base
-- pgvector-powered semantic search for AI agents
-- ============================================================

-- 1. Enable the open-source pgvector extension
create extension if not exists vector;

-- 2. Create a table to house your multidisciplinary construction knowledge
create table if not exists construction_knowledge (
  id uuid primary key default gen_random_uuid(),
  content text not null,                       -- The raw document text (e.g., a safety clause or cost item)
  category text not null,                      -- 'law', 'safety', 'surveying', 'architecture', 'engineering', 'contracts', 'materials', 'labour', 'plant', 'regulations'
  subcategory text,                            -- 'ohs_act', 'construction_regs', 'fidic', 'gcc', 'nec', 'jbcc', 'sans', 'colto', 'boq_pricing', 'rate_buildup'
  source text,                                 -- Document source reference
  metadata jsonb default '{}'::jsonb,          -- Extra tags like region, cost code, item reference
  embedding vector(384),                       -- Math vector representation (384 dims for open-source models)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create an advanced index to make searching through millions of rows instant
create index if not exists idx_construction_knowledge_embedding 
  on construction_knowledge using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 200);

-- 4. Metadata index for filtered searches
create index if not exists idx_construction_knowledge_category 
  on construction_knowledge(category);
create index if not exists idx_construction_knowledge_subcategory 
  on construction_knowledge(subcategory);

-- 5. Full-text search fallback
create index if not exists idx_construction_knowledge_content_fts 
  on construction_knowledge using gin(to_tsvector('english', content));

-- 6. Similarity search function
create or replace function match_construction_knowledge(
  query_embedding vector(384),
  match_count int default 10,
  filter_category text default null
)
returns table(
  id uuid,
  content text,
  category text,
  subcategory text,
  source text,
  metadata jsonb,
  similarity float
)
language plpgsql
as \$\$
begin
  return query
  select
    construction_knowledge.id,
    construction_knowledge.content,
    construction_knowledge.category,
    construction_knowledge.subcategory,
    construction_knowledge.source,
    construction_knowledge.metadata,
    1 - (construction_knowledge.embedding <=> query_embedding) as similarity
  from construction_knowledge
  where (filter_category is null or construction_knowledge.category = filter_category)
  order by construction_knowledge.embedding <=> query_embedding asc
  limit match_count;
end;
\$\$;

-- 7. RLS policies
alter table construction_knowledge enable row level security;

create policy "Knowledge base read access for authenticated users"
  on construction_knowledge for select
  to authenticated
  using (true);

create policy "Knowledge base insert for service role"
  on construction_knowledge for insert
  to service_role
  with check (true);

-- 8. Seed some foundational knowledge categories
insert into construction_knowledge (content, category, subcategory, source, metadata) values
('The Occupational Health and Safety Act 85 of 1993 provides for the health and safety of persons at work. Section 16 places duties on employers and self-employed persons. The Construction Regulations 2014 expand on this for construction works.', 'law', 'ohs_act', 'OHS Act 85/1993', '{"jurisdiction": "South Africa", "year": 1993}'),
('FIDIC Red Book 1999 is the Conditions of Contract for Construction for building and engineering works designed by the Employer. Key clauses: 20 (Claims), 13 (Variations), 14 (Contract Price), 8 (Time for Completion).', 'contracts', 'fidic', 'FIDIC Red Book 1999', '{"standard": "FIDIC", "edition": "1999 Red Book"}'),
('GCC 2015 - General Conditions of Contract for construction works in South Africa. Clause 52 deals with variations and valuation. Clause 44 addresses extension of time.', 'contracts', 'gcc', 'GCC 2015', '{"standard": "GCC", "edition": "2015"}'),
('NEC4 Engineering and Construction Contract (ECC): Core clauses include 60 (Compensation Events), 63 (Assessing Compensation Events), 50 (Payment). Early warning mechanism under clause 15.', 'contracts', 'nec', 'NEC4 ECC', '{"standard": "NEC", "edition": "4"}'),
('SANS 4000: Civil Engineering Measurement - Standard method of measurement for civil engineering works in South Africa. Covers earthworks, concrete, steel, roads, pipelines.', 'surveying', 'sans', 'SANS 4000', '{"standard": "SANS 4000"}'),
('COLTO Standard Specifications for Road and Bridge Works: Complete specification for road construction in South Africa. Covers materials, layers, asphalt, concrete roads, drainage.', 'engineering', 'colto', 'COLTO', '{"standard": "COLTO"}'),
('JBCC Principal Building Agreement 2018: Joint Building Contracts Committee agreement for building works. Key clauses on payment, completion, defects, and dispute resolution.', 'contracts', 'jbcc', 'JBCC 2018', '{"standard": "JBCC", "edition": "2018"}'),
('Risk Assessment Methodology: HIRA (Hazard Identification and Risk Assessment). Steps: 1) Identify hazards, 2) Assess risks (likelihood x severity), 3) Determine control measures, 4) Implement controls, 5) Monitor and review.', 'safety', 'risk_assessment', 'OHS Act Construction Regs', '{"type": "methodology"}'),
('Material pricing for concrete: Grade 20 = R1,850/m3, Grade 25 = R1,950/m3, Grade 30 = R2,100/m3. Ready-mix includes delivery up to 30km. Pumping extra R150-200/m3.', 'materials', 'concrete', 'SA Construction Pricing 2024', '{"region": "national", "year": 2024}'),
('Labour rates (2024): Skilled artisan R45-65/hr, Semi-skilled R28-38/hr, General worker R22-28/hr. Include 37% statutory overheads (UIF, COIDA, SDL, leave, bonus).', 'labour', 'rates', 'SA Labour Rates 2024', '{"region": "national", "year": 2024}')
on conflict do nothing;
