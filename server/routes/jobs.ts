import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { jobs } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

const CreateJob = z.object({ title: z.string(), location: z.string().optional(), description: z.string().optional() });
const UpdateJob = CreateJob.partial();

router.post('/', requireAuth, validate(CreateJob), asyncHandler(async (req, res) => {
	const payload = req.body as any;
	const insertRes: any = await db.insert(jobs).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Job posted' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(jobs).limit(limit).offset(offset);
	const result = await db.select({ total: sql`COUNT(*)` }).from(jobs);
	const total = Number(result[0]?.total) || 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const [record] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
	if (!record) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record });
}));

router.put('/:id', requireAuth, validate(UpdateJob), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.update(jobs).set(req.body as any).where(eq(jobs.id, id)).execute();
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await db.delete(jobs).where(eq(jobs.id, id)).execute();
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
