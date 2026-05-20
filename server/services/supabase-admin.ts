import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

// Initialize keys on demand
let activeAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (activeAdminClient) return activeAdminClient;

  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const finalKey = serviceKey || anonKey;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Auth Debug] Lazily initializing Supabase Admin Client...');
    console.log('[Auth Debug] Lazy URL:', url || 'MISSING');
    console.log('[Auth Debug] Lazy Key length:', finalKey ? finalKey.length : 0);
  }

  if (!url) {
    console.error('[Supabase Startup] ERROR: supabaseUrl is empty!');
    throw new Error('SUPABASE_URL is missing.');
  }
  if (!finalKey) {
    console.error('[Supabase Startup] ERROR: Both service role key and anon key are empty!');
    throw new Error('Supabase key is missing.');
  }

  try {
    activeAdminClient = createClient(url, finalKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws }
    });
    console.log('[Supabase Startup] supabaseAdmin successfully created dynamically.');
    return activeAdminClient;
  } catch (err: any) {
    console.error('[Supabase Init Error]: Failed to create client dynamically.', err.message || err);
    throw err;
  }
}

// Export a dynamic Proxy to make lazy initialization transparent to all importing modules
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

// Verify user JWT from Authorization header
export async function verifyUserToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Auth Debug] Received Auth Header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'undefined');
    console.log('[Auth Debug] Current process.env.SUPABASE_URL:', process.env.SUPABASE_URL || 'UNDEFINED');
    console.log('[Auth Debug] Current process.env.VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'UNDEFINED');
    console.log('[Auth Debug] Current process.env.SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0);
    console.log('[Auth Debug] Current process.env.VITE_SUPABASE_ANON_KEY length:', process.env.VITE_SUPABASE_ANON_KEY ? process.env.VITE_SUPABASE_ANON_KEY.length : 0);
    console.log('[Auth Debug] Is activeAdminClient initialized?', !!activeAdminClient);
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[Auth Debug] Missing or invalid Bearer header structure.');
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
  const usage = await getUserUsage(userId);
  if (!usage) return;

  await supabaseAdmin
    .from('user_usage')
    .update({ [field]: (usage[field] || 0) + 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}
