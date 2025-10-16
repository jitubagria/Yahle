import express from 'express';
import { z } from 'zod';
import { db } from '../../../lib/db';
import { courses } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { parsePagination } from '../../../lib/pagination';

const router = express.Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

router.get('/', async (req, res, next) => {
  try {
    // validate pagination via parsePagination helper
    const { limit, offset, page, pageSize } = parsePagination(req as any);
    const data = await db.select().from(courses).limit(limit).offset(offset);
    const result = await db.select({ total: sql`COUNT(*)` }).from(courses);
    const total = Number(result[0]?.total) || 0;
    res.json({ success: true, data, page, pageSize, total });
  } catch (err) {
    // lazy-load logger to avoid cycles
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logger = require('../../../lib/logger').default;
    logger.error({ err }, 'Failed to list courses');
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [record] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../../lib/logger').default;
    logger.error({ err }, 'Failed to get course');
    next(err);
  }
});

export default router;
