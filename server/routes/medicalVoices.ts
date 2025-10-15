import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { medicalVoices } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';
import { sql } from 'drizzle-orm';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional() });
const CreateVoice = z.object({ title: z.string(), bannerUrl: z.string().optional(), description: z.string().optional(), department: z.string().optional() });
const UpdateVoice = CreateVoice.partial();

router.post('/', requireAuth, validate(CreateVoice), asyncHandler(async (req, res) => {
	const resInsert: any = await db.insert(medicalVoices).values(req.body).execute();
	const id = resInsert.insertId as number;
	const [record] = await db.select().from(medicalVoices).where(eq(medicalVoices.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Medical voice created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(medicalVoices).limit(limit).offset(offset);
	const totalRes = await db.select({ total: sql`COUNT(*)` }).from(medicalVoices);
	const total = (totalRes as any)[0]?.total ?? 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await db.select().from(medicalVoices).where(eq(medicalVoices.id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateVoice), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(medicalVoices).set(req.body).where(eq(medicalVoices.id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(medicalVoices).where(eq(medicalVoices.id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
