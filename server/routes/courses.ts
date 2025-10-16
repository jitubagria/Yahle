import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../lib/db';
import { courses } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { ResultSetHeader } from 'mysql2';
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
	const payload = req.body;
	const result = await db.insert(courses).values(payload);
	const insertId = (result as unknown as ResultSetHeader).insertId;
	const [record] = await db.select().from(courses).where(eq(courses.id, insertId)).limit(1);
	res.status(201).json({ success: true, data: record, message: 'Course created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
		const data = await db.select().from(courses).limit(limit).offset(offset);
		const result = await db.select({ total: sql`COUNT(*)` }).from(courses);
		const total = Number(result[0]?.total) || 0;
	res.json({ success: true, data, page, pageSize, total });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		const [record] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
	if (!record) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record });
}));

router.put('/:id', requireAuth, validate(UpdateCourse), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		await db.update(courses).set(req.body as any).where(eq(courses.id, id)).execute();
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
		await db.delete(courses).where(eq(courses.id, id)).execute();
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
