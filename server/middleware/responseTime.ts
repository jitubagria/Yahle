// server/middleware/responseTime.ts
import { Request, Response, NextFunction } from 'express';

export function responseTime(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.once('finish', async () => {
    const ms = Date.now() - start;
    // lazy logger
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const _loggerMod = require('../utils/logger');
    const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;
    logger.info({ path: req.path, method: req.method, status: res.statusCode, timeMs: ms }, 'request:completed');

    try {
      // Lazy import of db and schema to avoid circular dependencies at startup
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { db } = require('../../lib/db');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { apiLogs } = require('../../drizzle/schema');

      // Insert into api_logs in a best-effort, non-blocking way
      await db.insert(apiLogs).values({
        request_id: (req as any).reqId ?? null,
        route: req.originalUrl ?? req.url,
        method: req.method,
        status: res.statusCode,
        duration_ms: ms,
        user_id: (req as any).user?.id ?? null,
      }).execute?.();
    } catch (e) {
      // If persisting metrics fails, log and continue.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const _loggerMod2 = require('../utils/logger');
      const logger2 = _loggerMod2?.logger ?? _loggerMod2?.default ?? _loggerMod2;
      logger2.error({ err: e }, 'Failed to persist api log');
    }
  });
  next();
}

export default responseTime;
