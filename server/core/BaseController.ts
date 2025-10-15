// BaseController: Abstract CRUD controller for Drizzle tables
export abstract class BaseController<T> {
  constructor(protected table: any, protected db: any) {}

  async list(req, res) {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const data = await this.db.select().from(this.table).limit(limit).offset(offset);
    res.json({ success: true, data });
  }

  async get(req, res) { /* ... */ }
  async create(req, res) { /* ... */ }
  async update(req, res) { /* ... */ }
  async delete(req, res) { /* ... */ }
}
