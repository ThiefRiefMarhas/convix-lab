import { supabase } from '../lib/supabase';

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
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
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

  return fetch(url, { ...options, headers });
}

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
}): AsyncGenerator<ChatStreamEvent> {
  const token = await getAuthToken();

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errText = await response.text();
    yield { type: 'error', data: { message: `Request failed: ${errText}` } };
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
