import { Router, Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _loggerMod = require('../../utils/logger');
const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;

import { db } from '../../../lib/db';
import { courseCertificates, certificates } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET / - list issued certificates
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await db.select().from(certificates).limit(100).orderBy((certificates as any).createdAt.desc);
    logger.info({ count: data.length }, 'Listed certificates');
    res.json({ success: true, data });
  } catch (err) {
    logger.error({ err }, 'Failed to list certificates');
    next(err);
  }
});

// GET /:id - get certificate details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const [record] = await db.select().from(certificates).where(eq((certificates as any).id, id)).limit(1);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    logger.error({ err }, 'Failed to get certificate');
    next(err);
  }
});

export default router;
