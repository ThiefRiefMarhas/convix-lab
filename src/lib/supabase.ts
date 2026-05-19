import { createClient } from '@supabase/supabase-js';

const rawUrl = (window as any).__ENV__?.VITE_SUPABASE_URL;
const rawKey = (window as any).__ENV__?.VITE_SUPABASE_ANON_KEY;

const supabaseUrl =
  rawUrl && !rawUrl.includes('__VITE_')
    ? rawUrl
    : (import.meta as any).env.VITE_SUPABASE_URL || '';

const supabaseAnonKey =
  rawKey && !rawKey.includes('__VITE_')
    ? rawKey
    : (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('__VITE_')) {
  console.warn("Supabase environment variables are missing. Auth will not function until configured.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
