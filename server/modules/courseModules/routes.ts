import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../../../lib/db';
import { courseModules } from '../../../drizzle/schema';
import { eq, sql, and } from 'drizzle-orm';
import { parsePagination } from '../../../lib/pagination';
// safe logger shim
const { logger } = require('../../utils/logger');

const router = Router();

// GET / - paginated list
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset, page, pageSize } = parsePagination(req as any);
    const data = await db.select().from(courseModules).limit(limit).offset(offset);
    const result = await db.select({ total: sql`COUNT(*)` }).from(courseModules);
    const total = Number(result[0]?.total) || 0;
    res.json({ success: true, data, page, pageSize, total });
  } catch (err) {
    logger.error({ err }, 'Failed to list course modules');
    next(err);
  }
});

// GET /:id - get by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const [record] = await db.select().from(courseModules).where(eq((courseModules as any).id, id)).limit(1);
    if (!record) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    logger.error({ err }, 'Failed to get course module');
    next(err);
  }
});

// POST / - create
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as any;
    // check duplicate by courseId + title
    const existing = await db.select().from(courseModules).where(and(eq((courseModules as any).courseId, payload.courseId), eq((courseModules as any).title, payload.title))).limit(1);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Duplicate module' });
    }
    const result: any = await db.insert(courseModules).values(payload).execute();
    const insertId = result?.insertId as number;
    const [record] = await db.select().from(courseModules).where(eq((courseModules as any).id, insertId)).limit(1);
    res.status(201).json({ success: true, data: record, message: 'Course module created' });
  } catch (err) {
    logger.error({ err }, 'Failed to create course module');
    next(err);
  }
});

export default router;
