import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Authentication middleware that validates user session
 * In a production app, this would check session cookies or JWT tokens
 * For now, we require a valid userId in the request header
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // In production, this would extract userId from session cookie or JWT
    // For now, require X-User-Id header (temporary for development)
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify user exists
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId as string)))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    // Attach user to request for downstream handlers
    (req as any).authenticatedUser = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Get authenticated user from request
 */
export function getAuthenticatedUser(req: Request) {
  return (req as any).authenticatedUser;
}
