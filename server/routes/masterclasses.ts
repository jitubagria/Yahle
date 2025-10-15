import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { masterclasses } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
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
	const insertRes: any = await (db as any).insert(masterclasses).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await (db as any).select().from(masterclasses).where(eq((masterclasses as any).id, id)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Masterclass created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await (db as any).select().from(masterclasses).limit(limit).offset(offset);
	const [{ total }] = await (db as any).select({ total: (db as any).raw('COUNT(*)') }).from(masterclasses) as any[];
	res.json({ success: true, data, page, pageSize, total: total || 0 });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await (db as any).select().from(masterclasses).where(eq((masterclasses as any).id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateMasterclass), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await (db as any).update(masterclasses).set(req.body as any).where(eq((masterclasses as any).id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await (db as any).delete(masterclasses).where(eq((masterclasses as any).id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
