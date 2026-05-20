import { supabase } from '../lib/supabase';
import { getApiUrl } from '../lib/api-base';
import { parseHttpErrorBody } from '../lib/user-errors';

/**
 * Get the current user's Supabase access token for API calls.
 */
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make an authenticated API request.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const fullUrl = url.startsWith('http') ? url : getApiUrl(url);

  return fetch(fullUrl, {
    ...options,
    headers,
    cache: 'no-store',
  });
}

export const api = {
  get: async (path: string) => {
    const res = await apiFetch(`/api${path.startsWith('/') ? path : '/' + path}`);
    if (!res.ok) throw { response: { status: res.status, data: await res.json().catch(() => ({})) } };
    return { data: await res.json() };
  },
  post: async (path: string, body?: any) => {
    const res = await apiFetch(`/api${path.startsWith('/') ? path : '/' + path}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw { response: { status: res.status, data: await res.json().catch(() => ({})) } };
    return { data: await res.json() };
  },
  patch: async (path: string, body?: any) => {
    const res = await apiFetch(`/api${path.startsWith('/') ? path : '/' + path}`, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw { response: { status: res.status, data: await res.json().catch(() => ({})) } };
    return { data: await res.json() };
  }
};

export default api;

// ─── Conversations ──────────────────────────────────────────

export interface Conversation {
  id: string;
  title: string | null;
  model: string;
  status: string;
  message_count: number;
  source_count: number;
  last_message_at: string | null;
  created_at: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await apiFetch('/api/conversations');
  if (!res.ok) return [];
  const data = await res.json();
  return data.conversations || [];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata: any;
  created_at: string;
}

export interface ResearchSource {
  id: string;
  url: string;
  title: string | null;
  domain: string | null;
  snippet: string | null;
  relevance_score: number | null;
  source_type: string;
  search_query: string | null;
  created_at: string;
}

export interface ConversationDetail {
  conversation: Conversation;
  messages: Message[];
  sources: ResearchSource[];
}

export async function getConversation(id: string): Promise<ConversationDetail | null> {
  const res = await apiFetch(`/api/conversations/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function deleteConversation(id: string): Promise<boolean> {
  const res = await apiFetch(`/api/conversations/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function renameConversation(id: string, title: string): Promise<boolean> {
  const res = await apiFetch(`/api/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
  return res.ok;
}

// ─── Chat (SSE Streaming) ───────────────────────────────────

export interface ChatStreamEvent {
  type: 'token' | 'tool_start' | 'tool_result' | 'done' | 'error' | 'conversation_created' | 'title_generated' | 'phase_start' | 'phase_progress' | 'phase_complete' | 'source_found' | 'analysis_complete' | 'thinking_step' | 'thinking_complete';
  data: any;
}

/**
 * Send a chat message and receive a streaming response via SSE.
 * Returns an async generator of events.
 */
export async function* streamChat(params: {
  conversationId?: string;
  message?: string;
  model?: string;
  webSearchEnabled?: boolean;
  attachmentIds?: string[];
  analysisMode?: boolean;
  locale?: 'id' | 'en';
  indonesiaFocus?: boolean;
}): AsyncGenerator<ChatStreamEvent> {
  const token = await getAuthToken();

  let response: Response;
  try {
    response = await fetch(getApiUrl('/api/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(params),
      cache: 'no-store',
    });
  } catch (err) {
    yield { type: 'error', data: { message: (err as Error).message, network: true } };
    return;
  }

  if (!response.ok) {
    const errText = await response.text();
    const message = parseHttpErrorBody(errText);
    yield { type: 'error', data: { message, status: response.status } };
    return;
  }

  if (!response.body) {
    yield { type: 'error', data: { message: 'No response body' } };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('event: ')) {
          currentEvent = trimmed.slice(7);
        } else if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          try {
            const data = JSON.parse(dataStr);
            yield { type: currentEvent as ChatStreamEvent['type'], data };
          } catch {
            // skip malformed
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ─── File Upload ────────────────────────────────────────────

export interface UploadResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  hasText: boolean;
}

export async function uploadFile(file: File, conversationId?: string): Promise<UploadResult | null> {
  const formData = new FormData();
  formData.append('file', file);
  if (conversationId) {
    formData.append('conversationId', conversationId);
  }

  const res = await apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) return null;
  return res.json();
}
