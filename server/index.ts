import 'dotenv/config';
import 'express-session';
import createApp from './app';
import { ENV } from '../lib/env';
import { requestLogger } from '../lib/logger';
import type { Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import { setupWebSocket } from './liveQuiz';
import { initializeNPAScheduler } from './npaScheduler';

const app = createApp();

// Attach small request logger middleware for API-specific logging
app.use((req: Request, res: Response, next: NextFunction) => {
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

async function start() {
  const server = await registerRoutes(app);

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

      // Quiz status mapping for clarity
      const QUIZ_STATUS = {
        DRAFT: 'draft',
        ACTIVE: 'active',
        ARCHIVED: 'archived',
      };

      const now = new Date();
      const quizzesToStart = await db.select().from(quizzes).where(
        and(lte(quizzes.startTime, now), eq(quizzes.status, QUIZ_STATUS.DRAFT))
      );

      for (const quiz of quizzesToStart) {
        try {
          await db.update(quizzes).set({ status: QUIZ_STATUS.ACTIVE }).where(eq(quizzes.id, quiz.id));
          const roomName = `quiz-${quiz.id}`;
          io.to(roomName).emit('quiz:auto-start', { quizId: quiz.id, title: quiz.title, message: 'Quiz is starting automatically...' });
          startLiveQuiz(quiz.id).catch(async (err: Error) => {
            console.error(`Auto-start orchestration error for quiz ${quiz.id}:`, err);
            try {
              await db.update(quizzes).set({ status: QUIZ_STATUS.DRAFT }).where(eq(quizzes.id, quiz.id));
            } catch (revertErr) {
              console.error(`Failed to revert quiz ${quiz.id} status:`, revertErr);
            }
          });
        } catch (err) {
          console.error(`Failed to auto-start quiz ${quiz.id}:`, err);
        }
      }
    } catch (error) {
      // non-fatal, scheduler should not crash the server
      console.error('Auto-start scheduler error (non-fatal):', error);
    }
  }

  setInterval(autoStartQuizzes, 30_000);
  autoStartQuizzes();

  // Initialize NPA automation scheduler (non-blocking)
  try {
    initializeNPAScheduler();
  } catch (err) {
    console.error('NPA scheduler initialization error (non-fatal):', err);
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
      console.log('✅ Connected to DB:', process.env.DATABASE_URL?.split('@')[1] ?? 'unknown');
    }
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
