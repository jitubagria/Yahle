// server/middleware/responseTime.ts
import { Request, Response, NextFunction } from 'express';

export function responseTime(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.once('finish', () => {
    const ms = Date.now() - start;
    // lazy logger
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const _loggerMod = require('../utils/logger');
    const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;
    logger.info({ path: req.path, method: req.method, status: res.statusCode, timeMs: ms }, 'request:completed');
  });
  next();
}

export default responseTime;
