import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { medicalVoiceSupporters } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';
import { sql } from 'drizzle-orm';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional() });
const CreateSupporter = z.object({ voiceId: z.number(), userId: z.number() });
const UpdateSupporter = CreateSupporter.partial();

router.post('/', requireAuth, validate(CreateSupporter), asyncHandler(async (req, res) => {
	const resInsert: any = await db.insert(medicalVoiceSupporters).values(req.body).execute();
	const id = resInsert.insertId as number;
	const [record] = await db.select().from(medicalVoiceSupporters).where(eq(medicalVoiceSupporters.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Supporter created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(medicalVoiceSupporters).limit(limit).offset(offset);
	const totalRes = await db.select({ total: sql`COUNT(*)` }).from(medicalVoiceSupporters);
	const total = (totalRes as any)[0]?.total ?? 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await db.select().from(medicalVoiceSupporters).where(eq(medicalVoiceSupporters.id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateSupporter), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(medicalVoiceSupporters).set(req.body).where(eq(medicalVoiceSupporters.id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(medicalVoiceSupporters).where(eq(medicalVoiceSupporters.id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
