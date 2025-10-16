import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import api from './routes/_register';
import { registerRoutes as registerClean } from './routes_clean';
import { errorMiddleware } from '../lib/errors';
import { NODE_ENV } from './lib/env';
import logger from './lib/logger';

export async function createApp() {
  const app = express();
  app.use(helmet());
  // allow credentials for cookie-based refresh tokens from trusted origins
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? true, credentials: true }));
  app.use(cookieParser());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  // Request correlation: attach a reqId to each request and log it
  // Use crypto.randomUUID() for correlation ids
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = await import('crypto');
  app.use((req, _res, next) => {
    const reqId = (randomUUID && (randomUUID as any)()) || String(Date.now());
    (req as any).reqId = reqId;
    logger.info({ reqId, method: req.method, url: req.url }, 'Incoming request');
    next();
  });
  // Performance metrics: record response time and persist to api_logs
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: responseTimeMiddleware } = require('./middleware/responseTime');
  app.use(responseTimeMiddleware);
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  // Enforce HTTPS in production behind a proxy/load-balancer
  if (NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https' && req.protocol !== 'https') {
        const host = req.headers.host;
        return res.redirect(301, `https://${host}${req.originalUrl}`);
      }
      return next();
    });
  }


  // Root route for API server status
  app.get('/', (_req, res) => {
    res.status(200).json({ success: true, message: 'API server running' });
  });

  // Basic health route here so imports/tests can use the app without starting the server
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // During tests or when specifically requested, mount a minimal clean route registry
  const useClean = NODE_ENV === 'test' || process.env.USE_CLEAN_ROUTES === '1';
  if (useClean) {
    // registerClean may mount auth router under /api/auth
    try {
      await registerClean(app);
    } catch (e) {
      logger.error({ err: e }, 'Failed to register clean routes');
    }
  } else {
    app.use('/api', api);
  }

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use(errorMiddleware);
  return app;
}

export default createApp;
