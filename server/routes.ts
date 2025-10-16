import type { Express, Request, Response } from 'express';
import { createServer, Server } from 'http';

// Reintroduce modular route handlers in a safe, lazy-loaded manner.
// Keep /health stub for tests.
export async function registerRoutes(app: Express): Promise<Server> {
  app.use((req: Request, _res: Response, next) => {
    try {
      if (req.headers['content-type']?.includes('application/json') && typeof (req as any).body === 'string') {
        (req as any).body = JSON.parse((req as any).body);
      }
    } catch (_) {
      // ignore
    }
    next();
  });

  app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() }));

  // Mount modular routers where available. Use lazy requires to avoid
  // loading the entire route tree at module init and to prevent
  // circular import issues with the logger.
  try {
    // auth
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authRouter = require('./modules/auth/routes').default;
    app.use('/api/auth', authRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/auth routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount auth router');
    app.get('/api/auth', (_req: Request, res: Response) => res.json({ message: 'auth endpoint (stub)' }));
  }

  try {
    // quizzes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const quizzesRouter = require('./modules/quizzes/routes').default;
    app.use('/api/quizzes', quizzesRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/quizzes routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount quizzes router');
    app.get('/api/quizzes', (_req: Request, res: Response) => res.json({ message: 'quizzes endpoint (stub)' }));
  }

  try {
    // research
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const researchRouter = require('./modules/research/routes').default;
    app.use('/api/research', researchRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/research routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount research router');
    app.get('/api/research', (_req: Request, res: Response) => res.json({ message: 'research endpoint (stub)' }));
  }

  try {
    // npa-automation
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const npaRouter = require('./modules/npa-automation/routes').default;
    app.use('/api/npa-automation', npaRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/npa-automation routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount npa-automation router');
    app.get('/api/npa-automation', (_req: Request, res: Response) => res.json({ message: 'npa-automation endpoint (stub)' }));
  }

  try {
    // course-modules
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  const courseModulesRouter = require('./modules/courseModules/routes').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authMiddleware = require('./middleware/auth').verifyToken;
  app.use('/api/course-modules', authMiddleware, courseModulesRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/course-modules routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount course-modules router');
    app.get('/api/course-modules', (_req: Request, res: Response) => res.json({ message: 'course-modules endpoint (stub)' }));
  }

  try {
    // enrollments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  const enrollmentsRouter = require('./modules/enrollments/routes').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authMiddleware = require('./middleware/auth').verifyToken;
  app.use('/api/enrollments', authMiddleware, enrollmentsRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/enrollments routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount enrollments router');
    app.get('/api/enrollments', (_req: Request, res: Response) => res.json({ message: 'enrollments endpoint (stub)' }));
  }

  try {
    // job-applications
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jobApplicationsRouter = require('./modules/jobApplications/routes').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authMiddleware = require('./middleware/auth').verifyToken;
  app.use('/api/job-applications', authMiddleware, jobApplicationsRouter);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.debug('Mounted /api/job-applications routes');
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./lib/logger').default;
    logger.error({ err }, 'Failed to mount job-applications router');
    app.get('/api/job-applications', (_req: Request, res: Response) => res.json({ message: 'job-applications endpoint (stub)' }));
  }

  // courses and jobs routers are not present as modular route files in
  // server/modules; keep lightweight stubs to preserve existing behavior.
  app.get('/api/courses', (_req: Request, res: Response) => res.json({ data: [] }));
  app.get('/api/jobs', (_req: Request, res: Response) => res.json({ message: 'jobs endpoint (stub)' }));

  const server = createServer();
  server.on('request', app as any);
  return server;
}
