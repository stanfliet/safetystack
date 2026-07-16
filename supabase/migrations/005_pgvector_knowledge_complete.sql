-- Enable required extensions
create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- Create construction_knowledge table with vector support
create table if not exists construction_knowledge (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  category text not null,
  subcategory text default '',
  metadata jsonb default '{}',
  embedding vector(384),
  source text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create HNSW index for fast vector similarity search
create index if not exists idx_construction_knowledge_embedding
  on construction_knowledge using hnsw (embedding vector_cosine_ops);

-- Create full-text search index
create index if not exists idx_construction_knowledge_content_fts
  on construction_knowledge using gin(to_tsvector('english', content));

-- Create match_construction_knowledge function for hybrid search
create or replace function match_construction_knowledge(
  query_embedding vector(384),
  match_count int default 10,
  filter_category text default null
)
returns table(id uuid, content text, category text, subcategory text, metadata jsonb, source text, similarity float)
language plpgsql
as \$\$
begin
  return query
  select
    construction_knowledge.id,
    construction_knowledge.content,
    construction_knowledge.category,
    construction_knowledge.subcategory,
    construction_knowledge.metadata,
    construction_knowledge.source,
    1 - (construction_knowledge.embedding <=> query_embedding) as similarity
  from construction_knowledge
  where (filter_category is null or construction_knowledge.category = filter_category)
  order by construction_knowledge.embedding <=> query_embedding asc
  limit match_count;
end;
\$\$;

-- Create full-text search fallback function
create or replace function search_knowledge_fts(
  search_query text,
  filter_category text default null,
  match_count int default 10
)
returns table(id uuid, content text, category text, subcategory text, metadata jsonb, source text, rank float)
language plpgsql
as \$\$
begin
  return query
  select
    construction_knowledge.id,
    construction_knowledge.content,
    construction_knowledge.category,
    construction_knowledge.subcategory,
    construction_knowledge.metadata,
    construction_knowledge.source,
    ts_rank(to_tsvector('english', construction_knowledge.content), plainto_tsquery('english', search_query)) as rank
  from construction_knowledge
  where
    to_tsvector('english', construction_knowledge.content) @@ plainto_tsquery('english', search_query)
    and (filter_category is null or construction_knowledge.category = filter_category)
  order by rank desc
  limit match_count;
end;
\$\$;