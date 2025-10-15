export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function errorMiddleware(err: any, _req: any, res: any, _next: any) {
  const status = err?.status || 500;
  const payload: any = { error: err?.message || 'Internal Error' };
  if (process.env.NODE_ENV !== 'production' && err?.stack) payload.stack = err.stack;
  res.status(status).json(payload);
}
