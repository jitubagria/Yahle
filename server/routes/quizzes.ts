import { Router } from 'express';
import { z } from 'zod';
const router = Router();
import { db } from '../../lib/db';
import { quizzes } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../lib/validate';
import { parsePagination } from '../../lib/pagination';
import { requireAuth } from '../../lib/auth';

const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1).optional(), pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(), q: z.string().optional() });

const CreateQuiz = z.object({ title: z.string(), description: z.string().optional(), category: z.string().optional(), duration: z.number().optional() });
const UpdateQuiz = CreateQuiz.partial();

router.post('/', requireAuth, validate(CreateQuiz), asyncHandler(async (req, res) => {
	const payload = req.body as any;
	const { insertAndFetch } = await import('../dbHelpers');
	const record = await insertAndFetch(db as any, quizzes as any, payload);
	res.status(201).json({ success: true, data: record, message: 'Quiz created' });
}));

router.get('/', validate(ListQuery, 'query'), asyncHandler(async (req, res) => {
	const { limit, offset, page, pageSize } = parsePagination(req as any);
	const data = await (db as any).select().from(quizzes).limit(limit).offset(offset);
	const [{ total }] = await (db as any).select({ total: (db as any).raw('COUNT(*)') }).from(quizzes) as any[];
	res.json({ success: true, data, page, pageSize, total: total || 0 });
}));

router.get('/:id', asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const record = await (db as any).select().from(quizzes).where(eq((quizzes as any).id, id)).limit(1);
	if (!record || record.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
	res.json({ success: true, data: record[0] });
}));

router.put('/:id', requireAuth, validate(UpdateQuiz), asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await (db as any).update(quizzes).set(req.body as any).where(eq((quizzes as any).id, id));
	res.json({ success: true, message: 'Updated' });
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	await (db as any).delete(quizzes).where(eq((quizzes as any).id, id));
	res.json({ success: true, message: 'Deleted' });
}));

export default router;
