import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (window as any).__ENV__?.VITE_SUPABASE_URL ||
  (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  (window as any).__ENV__?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('__VITE_')) {
  console.warn("Supabase environment variables are missing. Auth will not function until configured.");
}

export const supabase = createClient(
  supabaseUrl && !supabaseUrl.includes('__VITE_') ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey && !supabaseAnonKey.includes('__VITE_') ? supabaseAnonKey : 'placeholder'
);
