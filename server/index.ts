import 'dotenv/config';
import 'express-session';
import createApp from './app';
import { ENV } from '../lib/env';
import { createServer } from 'http';
import requestLogger from '../lib/logger';
import logger from './lib/logger';
import type { Request, Response, NextFunction } from 'express';
// Use temporary clean routes implementation while fixing server/routes.ts
import { registerRoutes } from './routes_clean';
import { setupVite, serveStatic, log } from './vite';
import { setupWebSocket } from './liveQuiz';
import { initializeNPAScheduler } from './npaScheduler';

// Attach small request logger middleware for API-specific logging
// createApp is async; initialize app inside start()

let app: any;

// Attach small request logger middleware will be applied after app is created

function attachRequestLogger(appInstance: any) {
  appInstance.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.json = function (bodyJson: any, ..._args: any[]) {
      capturedJsonResponse = bodyJson;
      // call with the primary body argument to satisfy the Response.json signature
      return originalResJson.call(res, bodyJson);
    } as typeof res.json;

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (path.startsWith('/api')) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          try {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          } catch (_) {
            // ignore stringify errors
          }
        }

        if (logLine.length > 120) {
          logLine = logLine.slice(0, 119) + '…';
        }

        log(logLine);
      }
    });

    next();
  });
}

async function start() {
  app = await createApp();
  attachRequestLogger(app);
  const server = createServer(app as any);

  // Setup WebSocket for live quizzes
  const { io, startLiveQuiz } = setupWebSocket(server);

  app.set('socketio', io);
  app.set('startLiveQuiz', startLiveQuiz);

  // Auto-start scheduler (best-effort, non-fatal)
  async function autoStartQuizzes() {
    try {
      const { db } = await import('./db');
      const { quizzes } = await import('../drizzle/schema');
      const { and, lte, eq } = await import('drizzle-orm');

      // Quiz status mapping for clarity (centralized)
  const { QUIZ_STATUS } = await import('../src/types/enums');
  const { QuizStatus } = await import('./enums');

      const now = new Date();
      const nowStr = now.toISOString();
      const quizzesToStart = await db.select().from(quizzes).where(
  and(lte(quizzes.startTime, nowStr), eq(quizzes.status, QuizStatus.DRAFT))
      );

      for (const quiz of quizzesToStart) {
        try {
          await db.update(quizzes).set({ status: QuizStatus.ACTIVE }).where(eq(quizzes.id, quiz.id));
          const roomName = `quiz-${quiz.id}`;
          io.to(roomName).emit('quiz:auto-start', { quizId: quiz.id, title: quiz.title, message: 'Quiz is starting automatically...' });
          startLiveQuiz(quiz.id).catch(async (err: Error) => {
            logger.error({ err, quizId: quiz.id }, `Auto-start orchestration error for quiz ${quiz.id}:`);
            try {
              await db.update(quizzes).set({ status: QuizStatus.DRAFT }).where(eq(quizzes.id, quiz.id));
            } catch (revertErr) {
              logger.error({ err: revertErr, quizId: quiz.id }, `Failed to revert quiz ${quiz.id} status:`);
            }
          });
        } catch (err) {
          logger.error({ err, quizId: quiz.id }, `Failed to auto-start quiz ${quiz.id}:`);
        }
      }
    } catch (error) {
      // non-fatal, scheduler should not crash the server
      logger.error({ err: error }, 'Auto-start scheduler error (non-fatal):');
    }
  }

  setInterval(autoStartQuizzes, 30_000);
  autoStartQuizzes();

  // Initialize NPA automation scheduler (non-blocking)
  try {
    initializeNPAScheduler();
  } catch (err) {
    logger.error({ err }, 'NPA scheduler initialization error (non-fatal):');
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
    // rethrow for logging/observability pipeline if present
    throw err;
  });

  if (app.get('env') === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const host = '127.0.0.1';
  const port = ENV.PORT || 5000;

  server.listen(port, host, () => {
    log(`✅ Server running at http://${host}:${port}`);
    if (process.env.NODE_ENV !== 'production') {
      logger.info('✅ Connected to DB:', { db: process.env.DATABASE_URL?.split('@')[1] ?? 'unknown' });
    }
  });
}

start().catch((err) => {
  logger.error({ err }, 'Failed to start server:');
  process.exit(1);
});
