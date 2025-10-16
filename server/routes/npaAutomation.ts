import express from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { npaAutomation } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const router = express.Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional() });
const CreateNPA = z.object({ userId: z.number(), month: z.string(), status: z.string().optional() });
const UpdateNPA = CreateNPA.partial();


// 👇 Base route handler
router.get('/', (req, res) => {
  res.json({
    message: 'NPA Automation API operational ✅',
    availableEndpoints: ['/generate', '/schedule', '/preview']
  });
});

// Existing POST route for creating NPA automation
router.post('/', requireAuth, validate(CreateNPA), asyncHandler(async (req, res) => {
	const payload = req.body;
	const insertRes: any = await db.insert(npaAutomation).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await db.select().from(npaAutomation).where(eq(npaAutomation.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'NPA automation created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(npaAutomation).limit(limit).offset(offset);
		const totalRes = await db.select({ total: sql`COUNT(*)` }).from(npaAutomation);
		const total = (totalRes as any)[0]?.total ?? 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await db.select().from(npaAutomation).where(eq(npaAutomation.id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateNPA), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(npaAutomation).set(req.body).where(eq(npaAutomation.id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(npaAutomation).where(eq(npaAutomation.id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
