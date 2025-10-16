// server/middleware/requestId.ts
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.headers['x-request-id'] || randomBytes(8).toString('hex');
  (req as any).requestId = id;
  res.setHeader('X-Request-Id', String(id));
  next();
}

export default requestId;
