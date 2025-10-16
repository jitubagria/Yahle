// Zod Validation Middleware
import { Request, Response, NextFunction } from "express";

export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.errors });
    }
    (req as any).validated = result.data;
    next();
  };
}
