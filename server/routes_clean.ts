import type { Express } from 'express';
import { createServer, Server } from 'http';

// Adapter to support legacy registerRoutes(app) signature while using
// the new router-based clean implementation.
import cleanRouter from './routes_clean_router';

export async function registerRoutes(app: Express): Promise<Server> {
  // mount the router under /api so existing tests continue to work
  app.use('/api', cleanRouter as any);
  const server = createServer();
  server.on('request', app as any);
  return server;
}
