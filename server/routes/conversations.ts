import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';

const router = Router();

/**
 * GET /api/conversations
 * List user's conversations, most recent first.
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('id, title, model, status, message_count, source_count, last_message_at, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    res.status(500).json({ error: 'Failed to fetch conversations.' });
    return;
  }

  res.json({ conversations: data || [] });
});

/**
 * GET /api/conversations/:id
 * Get a single conversation with its messages and sources.
 */
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const convoId = req.params.id;

  // Get conversation
  const { data: convo, error: convoErr } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('id', convoId)
    .eq('user_id', userId)
    .single();

  if (convoErr || !convo) {
    res.status(404).json({ error: 'Conversation not found.' });
    return;
  }

  // Get messages
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('id, role, content, metadata, created_at')
    .eq('conversation_id', convoId)
    .order('created_at', { ascending: true });

  // Get research sources
  const { data: sources } = await supabaseAdmin
    .from('research_sources')
    .select('id, url, title, domain, snippet, relevance_score, source_type, search_query, created_at')
    .eq('conversation_id', convoId)
    .order('created_at', { ascending: true });

  res.json({
    conversation: convo,
    messages: messages || [],
    sources: sources || [],
  });
});

/**
 * PATCH /api/conversations/:id
 * Rename a conversation.
 */
router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const convoId = req.params.id;
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required.' });
    return;
  }

  const { error } = await supabaseAdmin
    .from('conversations')
    .update({ title: title.substring(0, 100) })
    .eq('id', convoId)
    .eq('user_id', userId);

  if (error) {
    res.status(500).json({ error: 'Failed to update conversation.' });
    return;
  }

  res.json({ success: true });
});

/**
 * DELETE /api/conversations/:id
 * Delete a conversation and all its data (cascade).
 */
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const convoId = req.params.id;

  const { error } = await supabaseAdmin
    .from('conversations')
    .delete()
    .eq('id', convoId)
    .eq('user_id', userId);

  if (error) {
    res.status(500).json({ error: 'Failed to delete conversation.' });
    return;
  }

  res.json({ success: true });
});

export default router;
