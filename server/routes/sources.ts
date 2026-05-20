import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';

const router = Router();

// GET /api/sources/:conversationId - Get all sources for a conversation
router.get('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user!.userId;

  try {
    const { data: sources, error } = await supabaseAdmin
      .from('research_sources')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(sources || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sources' });
  }
});

// PATCH /api/sources/:sourceId - Update annotation or bookmark
router.patch('/:sourceId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { sourceId } = req.params;
  const userId = req.user!.userId;
  const { annotation, is_bookmarked, relevance_score } = req.body;

  try {
    const updateData: any = {};
    if (annotation !== undefined) updateData.annotation = annotation;
    if (is_bookmarked !== undefined) updateData.is_bookmarked = is_bookmarked;
    if (relevance_score !== undefined) updateData.relevance_score = relevance_score;

    const { data: source, error } = await supabaseAdmin
      .from('research_sources')
      .update(updateData)
      .eq('id', sourceId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update source' });
  }
});

export default router;
