import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';
import { createCompletion } from '../services/openrouter.js';
import { detectIndonesian } from '../services/analysis-pipeline.js';

const router = Router();

// POST /api/insights/generate - Generate insights from conversation
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
      res.status(400).json({ error: 'No analysis report found to base Insights on.' });
      return;
    }

    const isIndonesian = detectIndonesian(reportMessage.content || '');

    // 3. Generate Insights using AI
    const prompt = `Based on the following market analysis report, extract a structured set of investment and strategic insights.
    
Format your response STRICTLY as a JSON object with this exact structure:
{
  "verdict": "green", // Or "yellow", "red" based on overall viability
  "viability_score": 85, // 0-100
  "key_metrics": {
    "tam": "$10B", // Estimated market size or "Unknown"
    "cagr": "15%" // Estimated growth or "Unknown"
  },
  "tags": ["saas", "b2b", "ai"], // Max 5 relevant tags
  "market_size": "Large ($1B+)", // Short string
  "competitor_count": 5, // Integer estimate of major competitors
  "difficulty": "medium", // "low", "medium", "high"
  "ai_summary": "One paragraph executive summary of the viability."
}
Do not output anything other than the JSON object.
${isIndonesian ? 'CRITICAL LANGUAGE INSTRUCTION: Since the report is written in Indonesian, you MUST write the values for the "market_size", "difficulty", "tags", and "ai_summary" fields in INDONESIAN language. Keep JSON keys in English as specified.' : 'CRITICAL LANGUAGE INSTRUCTION: Write all text values in ENGLISH language.'}

Report:
${reportMessage.content}`;

    const jsonStr = await createCompletion([{ role: 'user', content: prompt }], 'Convix Fast', 2000, 0.2);
    
    // Parse JSON
    let data;
    try {
      const startIdx = jsonStr.indexOf('{');
      const endIdx = jsonStr.lastIndexOf('}') + 1;
      data = JSON.parse(jsonStr.substring(startIdx, endIdx));
    } catch (e) {
      console.error('Failed to parse Insights JSON:', jsonStr);
      res.status(500).json({ error: 'Failed to generate valid Insights data' });
      return;
    }

    // 4. Save to database
    const { data: savedInsights, error: saveError } = await supabaseAdmin
      .from('conversation_insights')
      .upsert({
        conversation_id: conversationId,
        user_id: userId,
        verdict: data.verdict,
        viability_score: data.viability_score,
        key_metrics: data.key_metrics,
        tags: data.tags,
        market_size: data.market_size,
        competitor_count: data.competitor_count,
        difficulty: data.difficulty,
        ai_summary: data.ai_summary,
        updated_at: new Date().toISOString()
      }, { onConflict: 'conversation_id' })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    // 5. Also update conversation tags
    if (data.tags && data.tags.length > 0) {
      await supabaseAdmin.from('conversations')
        .update({ tags: data.tags })
        .eq('id', conversationId);
    }

    res.json(savedInsights);
  } catch (error: any) {
    console.error('Insights Generation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate insights' });
  }
});

// GET /api/insights/:conversationId - Get existing Insights
router.get('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user!.userId;

  try {
    const { data: insights, error } = await supabaseAdmin
      .from('conversation_insights')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Insights not found' });
      } else {
        throw error;
      }
      return;
    }

    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch insights' });
  }
});

export default router;
