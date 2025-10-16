import { Router, Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _loggerMod = require('../../utils/logger');
const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;

import registry from '../../jobs/registry';
import { db } from '../../../lib/db';

const router = Router();

// GET /api/metrics - simple admin metrics
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = registry.listJobs();
  // quick DB counts for key tables using raw SQL
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const schema = await import('../../../drizzle/schema');
  // Use drizzle sql tag to perform COUNT
  const { sql } = await import('drizzle-orm');
  const usersResult: any = await db.select({ total: sql`COUNT(*)` }).from(schema.users);
  const usersCount = Number(usersResult?.[0]?.total ?? 0);
  res.json({ success: true, jobs, counts: { users: usersCount } });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch metrics');
    next(err);
  }
});

export default router;
