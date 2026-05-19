import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('[Supabase Startup] process.env.SUPABASE_URL:', supabaseUrl || 'MISSING');
console.log('[Supabase Startup] process.env.SUPABASE_SERVICE_ROLE_KEY length:', supabaseServiceKey ? supabaseServiceKey.length : 0);
console.log('[Supabase Startup] process.env.VITE_SUPABASE_ANON_KEY length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

// Admin client — bypasses RLS, used for server-side writes
export let supabaseAdmin: SupabaseClient;
try {
  const finalKey = supabaseServiceKey || supabaseAnonKey;
  if (!supabaseUrl) {
    console.error('[Supabase Startup] ERROR: supabaseUrl is empty!');
  }
  if (!finalKey) {
    console.error('[Supabase Startup] ERROR: Both service role key and anon key are empty!');
  }

  supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder-dont-crash.supabase.co',
    finalKey || 'placeholder-anon-key',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  
  if (supabaseAdmin) {
    console.log('[Supabase Startup] supabaseAdmin successfully created.');
  } else {
    console.error('[Supabase Startup] supabaseAdmin is NULL after createClient!');
  }
} catch (err: any) {
  console.error('[Supabase Init Error]: Missing or invalid keys. Server will boot but DB operations will fail.', err.message || err);
  supabaseAdmin = null as any;
}

// Verify user JWT from Authorization header
export async function verifyUserToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  console.log('[Auth Debug] Received Auth Header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'undefined');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[Auth Debug] Missing or invalid Bearer header structure.');
    return null;
  }
  
  if (!supabaseAdmin) {
    console.error('[Auth Debug] supabaseAdmin client is not initialized!');
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('[Auth Debug] Parsed Token (JWT) length:', token.length);

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error('[Auth Debug] supabaseAdmin.auth.getUser failed with error:', error.message, error.status);
      return null;
    }

    if (!user) {
      console.error('[Auth Debug] supabaseAdmin.auth.getUser returned no user.');
      return null;
    }

    console.log('[Auth Debug] Successfully authenticated user:', user.email);
    return { userId: user.id, email: user.email || '' };
  } catch (err: any) {
    console.error('[Auth Debug] Unexpected exception in verifyUserToken:', err.message || err);
    return null;
  }
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
