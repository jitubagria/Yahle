import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema<any>, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = (req as any)[target];
      const parsed = schema.parse(data);
      (req as any)[target] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
