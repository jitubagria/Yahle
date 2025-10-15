import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { medicalVoiceGatherings } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';
import { sql } from 'drizzle-orm';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional() });
const CreateGathering = z.object({ voiceId: z.number(), date: z.string(), location: z.string().optional(), contactPerson: z.string().optional(), phone: z.string().optional() });
const UpdateGathering = CreateGathering.partial();

router.post('/', requireAuth, validate(CreateGathering), asyncHandler(async (req, res) => {
	const resInsert: any = await db.insert(medicalVoiceGatherings).values(req.body).execute();
	const id = resInsert.insertId as number;
	const [record] = await db.select().from(medicalVoiceGatherings).where(eq(medicalVoiceGatherings.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Gathering created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(medicalVoiceGatherings).limit(limit).offset(offset);
	const totalRes = await db.select({ total: sql`COUNT(*)` }).from(medicalVoiceGatherings);
	const total = (totalRes as any)[0]?.total ?? 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await db.select().from(medicalVoiceGatherings).where(eq(medicalVoiceGatherings.id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateGathering), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(medicalVoiceGatherings).set(req.body).where(eq(medicalVoiceGatherings.id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(medicalVoiceGatherings).where(eq(medicalVoiceGatherings.id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
