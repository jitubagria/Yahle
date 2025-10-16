// Pagination Middleware
import { Request, Response, NextFunction } from "express";

export function pagination(req: Request, res: Response, next: NextFunction) {
  // store pagination values on request (typed as any to avoid changing broader request types)
  (req as any).limit = Number(req.query.limit) || 20;
  (req as any).offset = Number(req.query.offset) || 0;
  next();
}
