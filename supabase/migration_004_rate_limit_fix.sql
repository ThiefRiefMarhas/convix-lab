-- ============================================================
-- CONVIX — Migration 004: Rate Limit & Analysis Counter Fix
-- Adds analyses_today column to track deep analyses separately
-- from Tavily search tool calls.
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Add analyses_today column to public.user_usage
ALTER TABLE public.user_usage
  ADD COLUMN IF NOT EXISTS analyses_today INTEGER NOT NULL DEFAULT 0;

-- Comment for clear documentation
COMMENT ON COLUMN public.user_usage.analyses_today IS 'Number of deep analyses started by the user today';
