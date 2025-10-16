import { Request, Response, NextFunction } from 'express';

// Use require to avoid depending on @types/jsonwebtoken in this change
const jwt: any = require('jsonwebtoken');

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'test-secret';
  try {
    const decoded = jwt.verify(token, secret);
    // attach user to request
    (req as any).user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
