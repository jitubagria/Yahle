import { Router } from 'express';
import { db } from '../../lib/db';
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
  const [rows] = await (db as any).execute(`SELECT * FROM users LIMIT ? OFFSET ?`, [limit, offset]);
  const [[{ total }]] = await (db as any).execute(`SELECT COUNT(*) as total FROM users`);
  res.json({ data: rows, page, pageSize, total: total || 0 });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await (db as any).execute(`SELECT * FROM users WHERE id = ?`, [req.params.id]);
  if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}));

router.post('/', validate(createDto), asyncHandler(async (req, res) => {
  const keys = Object.keys(req.body);
  const vals = Object.values(req.body);
  const placeholders = keys.map(() => '?').join(',');
  await (db as any).execute(`INSERT INTO users (${keys.join(',')}) VALUES (${placeholders})`, vals);
  res.status(201).json({ ok: true });
}));

router.patch('/:id', validate(updateDto), asyncHandler(async (req, res) => {
  const entries = Object.entries(req.body);
  if (!entries.length) return res.json({ ok: true });
  const sets = entries.map(([k]) => `\`${k}\` = ?`).join(', ');
  const vals = entries.map(([, v]) => v);
  await (db as any).execute(`UPDATE users SET ${sets} WHERE id = ?`, [...vals, req.params.id]);
  res.json({ ok: true });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await (db as any).execute(`DELETE FROM users WHERE id = ?`, [req.params.id]);
  res.json({ ok: true });
}));

export default router;
