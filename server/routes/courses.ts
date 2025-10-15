import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { courses } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const router = Router();

const ListQuery = z.object({
	page: z.coerce.number().int().min(1).default(1).optional(),
	pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
	q: z.string().optional(),
});

const CreateCourse = z.object({ title: z.string(), description: z.string().optional(), price: z.number().optional() });
const UpdateCourse = CreateCourse.partial();

router.post('/', requireAuth, validate(CreateCourse), asyncHandler(async (req, res) => {
	const payload = req.body as any;
	// Using any to work across adapters
	const insertRes: any = await (db as any).insert(courses).values(payload).execute();
	const id = insertRes.insertId as number;
	const [record] = await (db as any).select().from(courses).where(eq((courses as any).id, id)).limit(1);
		res.status(201).json({ success: true, data: record, message: 'Course created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
		const data = await (db as any).select().from(courses).limit(limit).offset(offset);
		const [{ total }] = await (db as any).select({ total: (db as any).raw('COUNT(*)') }).from(courses) as any[];
	res.json({ success: true, data, page, pageSize, total: total || 0 });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		const record = await (db as any).select().from(courses).where(eq((courses as any).id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateCourse), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		await (db as any).update(courses).set(req.body as any).where(eq((courses as any).id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		await (db as any).delete(courses).where(eq((courses as any).id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
