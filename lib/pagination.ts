import { Request } from 'express';

export function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return { page, pageSize, limit, offset, sort: String(req.query.sort ?? ''), q: String(req.query.q ?? '') };
}
