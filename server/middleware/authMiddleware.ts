// JWT Auth Middleware
import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // ...verify JWT
  next();
}
