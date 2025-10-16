// NPA Automation Controller
// Exports async CRUD functions for NPA automation
import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { npaTemplates, npaOptIns, npaAutomation } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ResultSetHeader } from 'mysql2';

export async function listTemplates(req: Request, res: Response) {
  const data = await db.select().from(npaTemplates).limit(50);
  res.json({ success: true, data });
}

export async function createTemplate(req: Request, res: Response) {
  const result = await db.insert(npaTemplates).values(req.body);
  const insertId = (result as unknown as ResultSetHeader).insertId;
  const data = await db.select().from(npaTemplates).where(eq(npaTemplates.id, insertId));
  res.json({ success: true, data: data[0] });
}

export async function listOptIns(req: Request, res: Response) {
  const data = await db.select().from(npaOptIns).limit(50);
  res.json({ success: true, data });
}

export async function createOptIn(req: Request, res: Response) {
  const result = await db.insert(npaOptIns).values(req.body);
  const insertId = (result as unknown as ResultSetHeader).insertId;
  const data = await db.select().from(npaOptIns).where(eq(npaOptIns.id, insertId));
  res.json({ success: true, data: data[0] });
}

export async function listAutomation(req: Request, res: Response) {
  const data = await db.select().from(npaAutomation).limit(50);
  res.json({ success: true, data });
}

export async function createAutomation(req: Request, res: Response) {
  const result = await db.insert(npaAutomation).values(req.body);
  const insertId = (result as unknown as ResultSetHeader).insertId;
  const data = await db.select().from(npaAutomation).where(eq(npaAutomation.id, insertId));
  res.json({ success: true, data: data[0] });
}
