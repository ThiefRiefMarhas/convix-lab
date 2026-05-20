import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';
import { createCompletion } from '../services/openrouter.js';
import { detectIndonesian } from '../services/analysis-pipeline.js';

const router = Router();

// POST /api/swot/generate - Generate SWOT from conversation
router.post('/generate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.body;
  const userId = req.user!.userId;

  if (!conversationId) {
    res.status(400).json({ error: 'Conversation ID is required' });
    return;
  }

  try {
    // 1. Verify ownership and get conversation
    const { data: conversation, error: convoError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convoError || !conversation || conversation.user_id !== userId) {
      res.status(403).json({ error: 'Unauthorized or conversation not found' });
      return;
    }

    // 2. Fetch the final analysis report
    const { data: messages } = await supabaseAdmin
      .from('messages')
      .select('content, metadata')
      .eq('conversation_id', conversationId)
      .eq('role', 'assistant')
      .order('created_at', { ascending: false });

    const reportMessage = (messages || []).find(m => m.metadata?.isAnalysisReport) || (messages || [])[0];

    if (!reportMessage) {
      res.status(400).json({ error: 'No analysis report found to base SWOT on.' });
      return;
    }

    const isIndonesian = detectIndonesian(reportMessage.content || '');

    // 3. Generate SWOT using AI
    const prompt = `Based on the following market analysis report, extract a structured SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.
    
Format your response STRICTLY as a JSON object with this exact structure:
{
  "strengths": [{ "text": "...", "score": 8, "evidence": "..." }],
  "weaknesses": [{ "text": "...", "score": 7, "evidence": "..." }],
  "opportunities": [{ "text": "...", "score": 9, "evidence": "..." }],
  "threats": [{ "text": "...", "score": 6, "evidence": "..." }],
  "overall_score": 7.5,
  "ai_summary": "Overall summary of the SWOT analysis..."
}
Do not output anything other than the JSON object. Scores should be 1-10.
${isIndonesian ? 'CRITICAL LANGUAGE INSTRUCTION: Since the report is written in Indonesian, you MUST write the values for the "text", "evidence", and "ai_summary" fields in INDONESIAN language. Do not output English for these fields. JSON keys must remain in English.' : 'CRITICAL LANGUAGE INSTRUCTION: Write all text values in ENGLISH language.'}

Report:
${reportMessage.content}`;

    const swotJsonStr = await createCompletion([{ role: 'user', content: prompt }], 'Convix Fast', 2000, 0.2, 120000, true);
    
    // Parse JSON
    let swotData;
    try {
      // Find JSON boundaries just in case
      const startIdx = swotJsonStr.indexOf('{');
      const endIdx = swotJsonStr.lastIndexOf('}') + 1;
      swotData = JSON.parse(swotJsonStr.substring(startIdx, endIdx));
    } catch (e) {
      console.error('Failed to parse SWOT JSON:', swotJsonStr);
      res.status(500).json({ error: 'Failed to generate valid SWOT data' });
      return;
    }

    // --- SANITIZATION FOR DATABASE ---
    const strengths = Array.isArray(swotData.strengths) ? swotData.strengths : [];
    const weaknesses = Array.isArray(swotData.weaknesses) ? swotData.weaknesses : [];
    const opportunities = Array.isArray(swotData.opportunities) ? swotData.opportunities : [];
    const threats = Array.isArray(swotData.threats) ? swotData.threats : [];
    
    let overallScore = parseFloat(swotData.overall_score);
    if (isNaN(overallScore)) {
      overallScore = 7.0;
    } else {
      overallScore = Math.max(1, Math.min(10, overallScore));
    }

    // 4. Save to database
    const { data: savedSwot, error: saveError } = await supabaseAdmin
      .from('swot_analyses')
      .upsert({
        conversation_id: conversationId,
        user_id: userId,
        strengths,
        weaknesses,
        opportunities,
        threats,
        overall_score: overallScore,
        ai_summary: swotData.ai_summary || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'conversation_id' })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    res.json(savedSwot);
  } catch (error: any) {
    console.error('SWOT Generation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate SWOT' });
  }
});

// GET /api/swot/:conversationId - Get existing SWOT
router.get('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user!.userId;

  try {
    const { data: swot, error } = await supabaseAdmin
      .from('swot_analyses')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'SWOT analysis not found' });
      } else {
        throw error;
      }
      return;
    }

    res.json(swot);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch SWOT' });
  }
});

// PATCH /api/swot/:conversationId - Update SWOT
router.patch('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user!.userId;
  const updates = req.body;

  try {
    // Only allow updating specific fields
    const allowedUpdates = ['strengths', 'weaknesses', 'opportunities', 'threats', 'ai_summary', 'overall_score'];
    const updateData: any = { updated_at: new Date().toISOString() };
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    }

    const { data: swot, error } = await supabaseAdmin
      .from('swot_analyses')
      .update(updateData)
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(swot);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update SWOT' });
  }
});

export default router;
