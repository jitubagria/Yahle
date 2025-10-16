import express from 'express';
import { z } from 'zod';
import { db } from '../../../lib/db';
import { jobs } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { parsePagination } from '../../../lib/pagination';

const router = express.Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

router.get('/', async (req, res, next) => {
  try {
    const { limit, offset, page, pageSize } = parsePagination(req as any);
    const data = await db.select().from(jobs).limit(limit).offset(offset);
    const result = await db.select({ total: sql`COUNT(*)` }).from(jobs);
    const total = Number(result[0]?.total) || 0;
    res.json({ success: true, data, page, pageSize, total });
  } catch (err) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logger = require('../../../lib/logger').default;
    logger.error({ err }, 'Failed to list jobs');
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body as any;
    const insertRes: any = await db.insert(jobs).values(payload).execute();
    const id = insertRes.insertId as number;
    const [record] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  res.status(201).json({ success: true, id: id ?? record?.id, data: record, title: record?.title, message: 'Job posted' });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../../lib/logger').default;
    logger.error({ err }, 'Failed to create job');
    next(err);
  }
});

export default router;
