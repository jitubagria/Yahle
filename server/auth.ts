import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Extend session type to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

/**
 * Authentication middleware that validates user session
 * Checks server-side session for userId
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify user exists
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      // Clear invalid session
      req.session.destroy(() => {});
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

/**
 * Admin authorization middleware
 * Requires authentication AND admin role
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify user exists and is admin
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Attach user to request
    (req as any).authenticatedUser = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(403).json({ error: 'Authorization failed' });
  }
}
