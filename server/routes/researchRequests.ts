import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { researchRequests } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';
import { sql } from 'drizzle-orm';
import { insertAndFetch, updateAndReturn, deleteAndReturn } from '../core/dbHelpers';

const router = Router();

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional() });
const CreateRequest = z.object({ userId: z.number(), title: z.string(), details: z.string().optional() });
const UpdateRequest = CreateRequest.partial();

router.post('/', requireAuth, validate(CreateRequest), asyncHandler(async (req, res) => {
	const record = await insertAndFetch(db, researchRequests, req.body as any);
	res.status(201).json({ success: true, data: record, message: 'Research request created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await db.select().from(researchRequests).limit(limit).offset(offset);
	const totalRes = await db.select({ total: sql`COUNT(*)` }).from(researchRequests);
	const total = (totalRes as any)[0]?.total ?? 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const [record] = await db.select().from(researchRequests).where(eq(researchRequests.id, id)).limit(1);
	if (!record) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record });
}));

router.put('/:id', requireAuth, validate(UpdateRequest), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	 await updateAndReturn(db, researchRequests, eq(researchRequests.id, id), req.body as any);
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	 await deleteAndReturn(db, researchRequests, eq(researchRequests.id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
