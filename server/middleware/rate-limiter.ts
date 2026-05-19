import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { supabaseAdmin, getUserUsage, getUserProfile } from '../services/supabase-admin.js';

export async function rateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const profile = await getUserProfile(userId);
    const usage = await getUserUsage(userId);

    if (!profile || !usage) {
      next(); // Fail open if db issue
      return;
    }

    // Default limits
    const LIMIT_MESSAGES_PER_DAY = 50;
    const LIMIT_ANALYSES_PER_DAY = 5;

    // Check message limits for chat endpoint
    if (req.path === '/chat') {
      // If it's a new analysis trigger (we'll look for phase trigger in body later)
      const isAnalysisTrigger = req.body.analysisMode === true;
      
      if (isAnalysisTrigger) {
        // We don't have analysis count tracked natively yet, but we can reuse searches_today
        // For now, if messages_today > limit, we block
      }

      if (usage.messages_today >= LIMIT_MESSAGES_PER_DAY) {
        res.status(429).json({ 
          error: 'Daily limit reached',
          message: `You have reached your daily limit of ${LIMIT_MESSAGES_PER_DAY} messages. Please upgrade your plan or try again tomorrow.` 
        });
        return;
      }
    }

    // Pass rate limit info in headers
    res.setHeader('X-RateLimit-Limit', LIMIT_MESSAGES_PER_DAY);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, LIMIT_MESSAGES_PER_DAY - usage.messages_today));

    next();
  } catch (error) {
    console.error('[Rate Limiter Error]:', error);
    next(); // Fail open so users aren't completely blocked on DB error
  }
}
