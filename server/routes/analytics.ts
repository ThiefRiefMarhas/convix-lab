import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase-admin.js';

const router = Router();

// GET /api/analytics - Get global analytics for the user
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    // 1. Get usage stats
    const { data: usage } = await supabaseAdmin
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 2. Get conversations stats
    const { data: conversations } = await supabaseAdmin
      .from('conversations')
      .select('id, created_at, tags')
      .eq('user_id', userId);

    // 3. Get sources stats
    const { data: sources } = await supabaseAdmin
      .from('research_sources')
      .select('domain')
      .eq('user_id', userId);

    // 4. Get insights stats for success rates
    const { data: insights } = await supabaseAdmin
      .from('conversation_insights')
      .select('verdict, viability_score')
      .eq('user_id', userId);

    // Aggregate domains
    const domainCounts: Record<string, number> = {};
    if (sources) {
      sources.forEach(s => {
        if (s.domain) {
          domainCounts[s.domain] = (domainCounts[s.domain] || 0) + 1;
        }
      });
    }
    const topDomains = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    // Aggregate tags
    const tagCounts: Record<string, number> = {};
    if (conversations) {
      conversations.forEach(c => {
        if (c.tags && Array.isArray(c.tags)) {
          c.tags.forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
          });
        }
      });
    }
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Viability distribution
    let avgViability = 0;
    const verdicts = { green: 0, yellow: 0, red: 0 };
    if (insights && insights.length > 0) {
      let totalScore = 0;
      let scoredCount = 0;
      insights.forEach(i => {
        if (i.viability_score !== null) {
          totalScore += i.viability_score;
          scoredCount++;
        }
        if (i.verdict) {
          verdicts[i.verdict as keyof typeof verdicts]++;
        }
      });
      if (scoredCount > 0) avgViability = Math.round(totalScore / scoredCount);
    }

    res.json({
      usage: usage || { messages_today: 0, searches_today: 0, files_total: 0, conversations_total: 0 },
      totals: {
        conversations: conversations?.length || 0,
        sources: sources?.length || 0,
        analyzedIdeas: insights?.length || 0
      },
      topDomains,
      topTags,
      viability: {
        averageScore: avgViability,
        distribution: verdicts
      }
    });
  } catch (error: any) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch analytics' });
  }
});

export default router;
