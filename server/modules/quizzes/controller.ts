// Quizzes Controller
// Exports async CRUD functions for quizzes
import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { quizzes } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { ResultSetHeader } from 'mysql2';
import { parsePagination } from '../../../lib/pagination';

export async function listQuizzes(req: Request, res: Response) {
  const { limit, offset, page, pageSize } = parsePagination(req);
  const data = await db.select().from(quizzes).limit(limit).offset(offset);
  const [{ total }] = await db.select({ total: sql`COUNT(*)` }).from(quizzes);
  res.json({ success: true, data, page, pageSize, total });
}

export async function getQuiz(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await db.select().from(quizzes).where(eq(quizzes.id, id));
  res.json({ success: true, data: data[0] });
}

export async function createQuiz(req: Request, res: Response) {
  const result = await db.insert(quizzes).values(req.body);
  const insertId = (result as unknown as ResultSetHeader).insertId;
  const data = await db.select().from(quizzes).where(eq(quizzes.id, insertId));
  res.status(201).json({ success: true, data: data[0] });
}

export async function updateQuiz(req: Request, res: Response) {
  const id = Number(req.params.id);
  await db.update(quizzes).set(req.body).where(eq(quizzes.id, id));
  res.json({ success: true, message: 'Quiz updated successfully' });
}

export async function deleteQuiz(req: Request, res: Response) {
  const id = Number(req.params.id);
  await db.delete(quizzes).where(eq(quizzes.id, id));
  res.json({ success: true, message: 'Quiz deleted successfully' });
}
