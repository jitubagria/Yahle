import { Router, Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _loggerMod = require('../../utils/logger');
const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;

import { db } from '../../../lib/db';
import { aiToolRequests } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET / - list available AI tools and recent requests
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tools = [
      { slug: 'summarizer', name: 'Text Summarizer' },
      { slug: 'qa', name: 'Question Answering' },
      { slug: 'translation', name: 'Translator' },
    ];

    const recent = await db.select().from(aiToolRequests).limit(20).orderBy(sql`created_at DESC`);
    logger.info({ count: recent.length }, 'Listed AI tools and recent requests');
    res.json({ success: true, tools, recent });
  } catch (err) {
    logger.error({ err }, 'Failed to list ai tools');
    next(err);
  }
});

// POST /:slug/run - enqueue/run a tool request
router.post('/:slug/run', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const payload = {
      userId: (req as any).user?.id ?? null,
      toolType: slug,
      inputData: JSON.stringify(req.body || {}),
    } as any;

    const result: any = await db.insert(aiToolRequests).values(payload).execute();
    const insertId = result?.insertId as number | undefined;
    let record: any = null;
    if (insertId) {
      [record] = await db.select().from(aiToolRequests).where(eq((aiToolRequests as any).id, insertId)).limit(1);
    }

    logger.info({ tool: slug, id: insertId }, 'Enqueued AI tool request');
    res.status(201).json({ success: true, id: insertId ?? null, data: record });
  } catch (err) {
    logger.error({ err }, 'Failed to enqueue ai tool');
    next(err);
  }
});

export default router;
