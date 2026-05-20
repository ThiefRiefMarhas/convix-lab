-- ============================================================
-- CONVIX — Migration 003: Feature Expansion
-- Adds exports, SWOT analyses, conversation insights, 
-- source annotations, and conversation tags
-- Run AFTER migration_002_vector_cache.sql
-- ============================================================

-- 1. EXPORTS TABLE
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('pdf', 'markdown', 'json')),
  template TEXT NOT NULL DEFAULT 'investor_pitch',
  title TEXT,
  content TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exports_conversation ON public.exports(conversation_id);
CREATE INDEX idx_exports_user ON public.exports(user_id);
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports" ON public.exports FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can create own exports" ON public.exports FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete own exports" ON public.exports FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- 2. SWOT ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.swot_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  opportunities JSONB NOT NULL DEFAULT '[]',
  threats JSONB NOT NULL DEFAULT '[]',
  overall_score FLOAT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id)
);

CREATE INDEX idx_swot_conversation ON public.swot_analyses(conversation_id);
CREATE INDEX idx_swot_user ON public.swot_analyses(user_id);
ALTER TABLE public.swot_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own SWOT" ON public.swot_analyses FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

-- 3. CONVERSATION INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.conversation_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID UNIQUE NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict TEXT CHECK (verdict IN ('green', 'yellow', 'red')),
  viability_score INTEGER CHECK (viability_score BETWEEN 0 AND 100),
  key_metrics JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  market_size TEXT,
  competitor_count INTEGER,
  difficulty TEXT CHECK (difficulty IN ('low', 'medium', 'high')),
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_insights_user ON public.conversation_insights(user_id);
ALTER TABLE public.conversation_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own insights" ON public.conversation_insights FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

-- 4. Add annotation column to research_sources
ALTER TABLE public.research_sources
  ADD COLUMN IF NOT EXISTS annotation TEXT,
  ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT false;

-- 5. Add tags and updated_at to conversations
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
