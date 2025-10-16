import { Router, Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _loggerMod = require('../../utils/logger');
const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;

import { db } from '../../../lib/db';
import * as schema from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /:entity - list (limited) for public mobile consumption
router.get('/:entity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entity } = req.params;
    switch (entity) {
      case 'courses': {
        const data = await db.select().from(schema.courses).limit(50);
        return res.json({ success: true, data });
      }
      case 'jobs': {
        const data = await db.select().from(schema.jobs).where(eq((schema.jobs as any).isActive, 1)).limit(50);
        return res.json({ success: true, data });
      }
      default:
        return res.status(400).json({ success: false, message: 'Unknown entity' });
    }
  } catch (err) {
    logger.error({ err }, 'Failed to serve public list');
    next(err);
  }
});

// GET /:entity/:id - read single
router.get('/:entity/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entity, id } = req.params;
    const nid = Number(id);
    switch (entity) {
      case 'courses': {
        const [record] = await db.select().from(schema.courses).where(eq((schema.courses as any).id, nid)).limit(1);
        if (!record) return res.status(404).json({ success: false, message: 'Not found' });
        return res.json({ success: true, data: record });
      }
      case 'jobs': {
        const [record] = await db.select().from(schema.jobs).where(eq((schema.jobs as any).id, nid)).limit(1);
        if (!record) return res.status(404).json({ success: false, message: 'Not found' });
        return res.json({ success: true, data: record });
      }
      default:
        return res.status(400).json({ success: false, message: 'Unknown entity' });
    }
  } catch (err) {
    logger.error({ err }, 'Failed to serve public get');
    next(err);
  }
});

export default router;
