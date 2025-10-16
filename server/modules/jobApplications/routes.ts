import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../../../lib/db';
import { jobApplications } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { parsePagination } from '../../../lib/pagination';

const router = Router();
// safe logger shim
const { logger } = require('../../utils/logger');

// GET / - paginated list
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset, page, pageSize } = parsePagination(req as any);
    const data = await db.select().from(jobApplications).limit(limit).offset(offset);
    const result = await db.select({ total: sql`COUNT(*)` }).from(jobApplications);
    const total = Number(result[0]?.total) || 0;
    res.json({ success: true, data, page, pageSize, total });
  } catch (err) {
    logger.error({ err }, 'Failed to list job applications');
    next(err);
  }
});

// POST / - create job application
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as any;
    const result: any = await db.insert(jobApplications).values(payload).execute();
    const insertId = result?.insertId as number;
    const [record] = await db.select().from(jobApplications).where(eq((jobApplications as any).id, insertId)).limit(1);
    logger.info({ applicationId: insertId }, 'Created job application');
    res.status(201).json({ success: true, data: record, message: 'Job application created' });
  } catch (err: any) {
    if (err && (err as any).code === 'ER_DUP_ENTRY') {
      logger.error({ err }, 'Duplicate job application');
      return res.status(400).json({ success: false, message: 'Duplicate application' });
    }
    logger.error({ err }, 'Failed to create job application');
    next(err);
  }
});

export default router;
