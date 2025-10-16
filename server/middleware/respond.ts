// Unified Response Formatter Middleware
import { Request, Response, NextFunction } from "express";

export function respond(req: Request, res: Response & any, next: NextFunction) {
  res.success = (data: any, message = 'OK') => res.json({ success: true, message, data });
  res.fail = (message = 'Error', code = 400) => res.status(code).json({ success: false, message });
  next();
}
