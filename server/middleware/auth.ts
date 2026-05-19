import { Request, Response, NextFunction } from 'express';
import { verifyUserToken } from '../services/supabase-admin.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Express middleware that validates Supabase JWT from Authorization header.
 * Attaches user info to req.user if valid.
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await verifyUserToken(req.headers.authorization);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
}
