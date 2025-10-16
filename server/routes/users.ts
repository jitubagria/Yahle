import { Router } from 'express';
import { db } from '../../lib/db';
import { users } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler';
import { parsePagination } from '../../lib/pagination';
import { z } from 'zod';
import { validate } from '../../lib/validate';

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
  sort: z.string().optional(),
  q: z.string().optional(),
});

const createDto = z.object({ name: z.string().min(1), email: z.string().email() });
const updateDto = createDto.partial();

const router = Router();

router.get('/', validate(listQuery, 'query'), asyncHandler(async (req, res) => {
  const { limit, offset, page, pageSize } = parsePagination(req as any);
  const data = await db.select().from(users).limit(limit).offset(offset);
  const [{ total }] = await db.select({ total: sql`COUNT(*)` }).from(users);
  res.json({ data, page, pageSize, total: Number(total) || 0 });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
}));

router.post('/', validate(createDto), asyncHandler(async (req, res) => {
  const payload = req.body;
  const insertRes: any = await db.insert(users).values(payload).execute();
  res.status(201).json({ ok: true, insertId: insertRes.insertId });
}));

router.patch('/:id', validate(updateDto), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await db.update(users).set(req.body as any).where(eq(users.id, id)).execute();
  res.json({ ok: true });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(users).where(eq(users.id, id)).execute();
  res.json({ ok: true });
}));

export default router;
