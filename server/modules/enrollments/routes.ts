import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../../../lib/db';
import { enrollments } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { parsePagination } from '../../../lib/pagination';

const router = Router();
// safe logger shim (robust resolution for CJS/ESM interop)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _loggerMod = require('../../utils/logger');
const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;

// GET / - list enrollments
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset, page, pageSize } = parsePagination(req as any);
    const data = await db.select().from(enrollments).limit(limit).offset(offset);
    const result = await db.select({ total: sql`COUNT(*)` }).from(enrollments);
    const total = Number(result[0]?.total) || 0;
    // Log action
  logger.info({ count: data.length }, 'Listed enrollments');
    res.json({ success: true, data, page, pageSize, total });
  } catch (err) {
    logger.error({ err }, 'Failed to list enrollments');
    next(err);
  }
});

// POST / - create enrollment
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as any;
    const result: any = await db.insert(enrollments).values(payload).execute();
    const insertId = result?.insertId as number;
    const [record] = await db.select().from(enrollments).where(eq((enrollments as any).id, insertId)).limit(1);
    logger.info({ enrollmentId: insertId }, 'Created enrollment');
    res.status(201).json({ success: true, data: record, message: 'Enrollment created' });
  } catch (err: any) {
    // handle duplicate key / constraint errors (MySQL code 1062)
    if (err && (err as any).code === 'ER_DUP_ENTRY') {
      logger.error({ err }, 'Duplicate enrollment');
      return res.status(400).json({ success: false, message: 'Duplicate enrollment' });
    }
    logger.error({ err }, 'Failed to create enrollment');
    next(err);
  }
});

export default router;
