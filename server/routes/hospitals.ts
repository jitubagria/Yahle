import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { hospitals } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

const CreateHospital = z.object({ name: z.string(), address: z.string().optional(), city: z.string().optional() });
const UpdateHospital = CreateHospital.partial();

router.post('/', requireAuth, validate(CreateHospital), asyncHandler(async (req, res) => {
	const payload = req.body as any;
	const insertRes: any = await db.insert(hospitals).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Hospital created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(hospitals).limit(limit).offset(offset);
	const [{ total }] = await db.select({ total: sql`COUNT(*)` }).from(hospitals);
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const [record] = await db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
	if (!record) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record });
}));

router.put('/:id', requireAuth, validate(UpdateHospital), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(hospitals).set(req.body as any).where(eq(hospitals.id, id)).execute();
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(hospitals).where(eq(hospitals.id, id)).execute();
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
