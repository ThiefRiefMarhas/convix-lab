import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';
import { generateExport } from '../services/export-engine.js';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId, format = 'markdown', template = 'investor_pitch' } = req.body;
  const userId = req.user!.userId;

  if (!conversationId) {
    res.status(400).json({ error: 'Conversation ID is required' });
    return;
  }

  if (format !== 'markdown' && format !== 'json') {
    res.status(400).json({ error: 'Unsupported format. Use markdown or json.' });
    return;
  }

  try {
    // Generate the export using the engine
    const exportResult = await generateExport({
      conversationId,
      format: format as 'markdown' | 'json',
      template,
      userId,
    });

    // Save to exports table for history
    await supabaseAdmin.from('exports').insert({
      conversation_id: conversationId,
      user_id: userId,
      format: exportResult.format,
      template,
      title: exportResult.title,
      content: exportResult.content,
      metadata: { generated_via: 'api' },
    });

    res.json(exportResult);
  } catch (error: any) {
    console.error('Export Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate export' });
  }
});

export default router;
