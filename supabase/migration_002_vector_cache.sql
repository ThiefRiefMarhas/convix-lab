-- ============================================================
-- CONVIX — Migration 002: Content Cache + Vector Search
-- Adds pgvector, content caching, smart storage
-- Run AFTER migration_001_core_schema.sql
-- ============================================================

-- 1. Enable pgvector extension (built-in to Supabase)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. CONTENT CACHE TABLE
-- Prevents re-scraping/re-searching the same URLs and queries.
-- Stores both raw content and AI-generated summaries.
CREATE TABLE IF NOT EXISTS public.content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cache key: either a URL or a search query
  cache_type TEXT NOT NULL CHECK (cache_type IN ('url', 'search_query')),
  cache_key TEXT NOT NULL,  -- URL or search query string
  
  -- Content storage (tiered)
  title TEXT,
  raw_content TEXT,           -- Full scraped/search content (for reference)
  summary TEXT,               -- AI-generated summary (this is what gets sent to LLM)
  summary_tokens INTEGER,     -- Approximate token count of summary
  
  -- Metadata
  domain TEXT,
  content_type TEXT,           -- 'webpage', 'search_results', 'pdf', etc
  word_count INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  
  -- Vector embedding for semantic search
  embedding vector(768),       -- Gemini embedding dimension
  
  -- Freshness tracking
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  hit_count INTEGER NOT NULL DEFAULT 0,
  
  -- Constraints
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(cache_type, cache_key)
);

CREATE INDEX idx_content_cache_key ON public.content_cache(cache_type, cache_key);
CREATE INDEX idx_content_cache_expires ON public.content_cache(expires_at);

-- Vector similarity search index (IVFFlat for fast approximate search)
-- Only created if we have enough rows; for now, use exact search
CREATE INDEX idx_content_cache_embedding ON public.content_cache 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

-- No RLS on cache — server-only table (accessed via service_role)
ALTER TABLE public.content_cache ENABLE ROW LEVEL SECURITY;
-- No public policies — only service_role can access


-- 3. Add summary column to research_sources
-- So we store both snippet and AI summary
ALTER TABLE public.research_sources 
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS token_count INTEGER DEFAULT 0;


-- 4. CONVERSATION CONTEXT BUDGET TABLE  
-- Tracks token usage per conversation to prevent blow-up
CREATE TABLE IF NOT EXISTS public.conversation_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Token tracking
  total_input_tokens INTEGER NOT NULL DEFAULT 0,
  total_output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tool_tokens INTEGER NOT NULL DEFAULT 0,   -- tokens used by tool results
  
  -- Budget
  max_context_tokens INTEGER NOT NULL DEFAULT 30000,  -- max tokens sent to LLM per turn
  max_tool_tokens_per_turn INTEGER NOT NULL DEFAULT 8000, -- max tokens from tools per turn
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_convo_token_usage ON public.conversation_token_usage(conversation_id);

ALTER TABLE public.conversation_token_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own token usage"
  ON public.conversation_token_usage FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);


-- 5. Helper function: clean expired cache entries (run periodically)
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.content_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Helper function: semantic search on cached content
CREATE OR REPLACE FUNCTION public.search_similar_content(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  cache_key TEXT,
  title TEXT,
  summary TEXT,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.id,
    cc.cache_key,
    cc.title,
    cc.summary,
    1 - (cc.embedding <=> query_embedding) AS similarity
  FROM public.content_cache cc
  WHERE cc.embedding IS NOT NULL
    AND cc.expires_at > now()
    AND 1 - (cc.embedding <=> query_embedding) > match_threshold
  ORDER BY cc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
