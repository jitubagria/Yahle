import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { masterclasses } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

const CreateMasterclass = z.object({ title: z.string(), description: z.string().optional(), eventDate: z.string().optional() });
const UpdateMasterclass = CreateMasterclass.partial();

router.post('/', requireAuth, validate(CreateMasterclass), asyncHandler(async (req, res) => {
	const payload = req.body as any;
	const insertRes: any = await db.insert(masterclasses).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await db.select().from(masterclasses).where(eq(masterclasses.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Masterclass created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(masterclasses).limit(limit).offset(offset);
	const [{ total }] = await db.select({ total: sql`COUNT(*)` }).from(masterclasses);
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await db.select().from(masterclasses).where(eq(masterclasses.id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateMasterclass), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(masterclasses).set(req.body as any).where(eq(masterclasses.id, id)).execute();
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(masterclasses).where(eq(masterclasses.id, id)).execute();
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
