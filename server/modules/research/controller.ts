// Research Services Controller
// Exports async CRUD functions for research services
import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { researchServiceRequests } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ResultSetHeader } from 'mysql2';

export async function listRequests(req: Request, res: Response) {
  const data = await db.select().from(researchServiceRequests).limit(50);
  res.json({ success: true, data });
}

export async function getRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await db.select().from(researchServiceRequests).where(eq(researchServiceRequests.id, id));
  res.json({ success: true, data: data[0] });
}

export async function createRequest(req: Request, res: Response) {
  const result = await db.insert(researchServiceRequests).values(req.body);
  const insertId = (result as unknown as ResultSetHeader).insertId;
  const data = await db.select().from(researchServiceRequests).where(eq(researchServiceRequests.id, insertId));
  res.json({ success: true, data: data[0] });
}

export async function updateRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  await db.update(researchServiceRequests).set(req.body).where(eq(researchServiceRequests.id, id));
  res.json({ success: true, message: 'Updated successfully' });
}

export async function deleteRequest(req: Request, res: Response) {
  const id = Number(req.params.id);
  await db.delete(researchServiceRequests).where(eq(researchServiceRequests.id, id));
  res.json({ success: true, message: 'Deleted successfully' });
}
