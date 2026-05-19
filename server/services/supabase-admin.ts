import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Admin client — bypasses RLS, used for server-side writes
export let supabaseAdmin: SupabaseClient;
try {
  supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder-dont-crash.supabase.co',
    supabaseServiceKey || supabaseAnonKey || 'placeholder-anon-key',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
} catch (err) {
  console.error('[Supabase Init Error]: Missing or invalid keys. Server will boot but DB operations will fail.', err);
  supabaseAdmin = null as any;
}

// Verify user JWT from Authorization header
export async function verifyUserToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  if (!supabaseAdmin) {
    console.warn('[Supabase Warning]: verifyUserToken skipped, database client is not initialized.');
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) return null;

  return { userId: user.id, email: user.email || '' };
}

// Helper: Get user profile
export async function getUserProfile(userId: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

// Helper: Get or reset user usage (resets daily counters)
export async function getUserUsage(userId: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // Create usage record if missing
    const { data: newData } = await supabaseAdmin
      .from('user_usage')
      .upsert({ user_id: userId, messages_today: 0, searches_today: 0 })
      .select()
      .single();
    return newData;
  }

  // Reset daily counters if date changed
  const today = new Date().toISOString().split('T')[0];
  if (data.last_reset_date !== today) {
    const { data: updated } = await supabaseAdmin
      .from('user_usage')
      .update({ messages_today: 0, searches_today: 0, last_reset_date: today, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    return updated;
  }

  return data;
}

// Helper: Increment usage counter
export async function incrementUsage(userId: string, field: 'messages_today' | 'searches_today' | 'files_total' | 'conversations_total') {
  if (!supabaseAdmin) return;
  const usage = await getUserUsage(userId);
  if (!usage) return;

  await supabaseAdmin
    .from('user_usage')
    .update({ [field]: (usage[field] || 0) + 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}
