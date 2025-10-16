// BaseController: Abstract CRUD controller for Drizzle tables
import { Request, Response, NextFunction } from "express";

export abstract class BaseController<T> {
  constructor(protected table: any, protected db: any) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const data = await this.db.select().from(this.table).limit(limit).offset(offset);
    res.json({ success: true, data });
  }

  async get(req: Request, res: Response, next: NextFunction) { /* ... */ }
  async create(req: Request, res: Response, next: NextFunction) { /* ... */ }
  async update(req: Request, res: Response, next: NextFunction) { /* ... */ }
  async delete(req: Request, res: Response, next: NextFunction) { /* ... */ }
}
