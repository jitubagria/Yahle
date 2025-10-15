import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import api from './routes/_register';
import { errorMiddleware } from '../lib/errors';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  // Basic health route here so imports/tests can use the app without starting the server
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', api);

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use(errorMiddleware);
  return app;
}

export default createApp;
