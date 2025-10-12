import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupWebSocket } from "./liveQuiz";
import { initializeNPAScheduler } from "./npaScheduler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
const MemoryStore = createMemoryStore(session);
export const sessionParser = session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

app.use(sessionParser);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Setup WebSocket for live quizzes
  const { io, startLiveQuiz } = setupWebSocket(server);
  
  // Store WebSocket instance in app for access in routes
  app.set('socketio', io);
  app.set('startLiveQuiz', startLiveQuiz);

  // Auto-start quizzes based on scheduled start time
  async function autoStartQuizzes() {
    try {
      const { db } = await import('./db');
      const { quizzes, quizQuestions } = await import('@shared/schema');
      const { and, lte, eq } = await import('drizzle-orm');

      // Find quizzes that should start now
      const now = new Date();
      const quizzesToStart = await db.select()
        .from(quizzes)
        .where(and(
          lte(quizzes.startTime, now),
          eq(quizzes.status, 'draft')
        ));

      for (const quiz of quizzesToStart) {
        console.log(`Auto-starting quiz: ${quiz.title} (ID: ${quiz.id})`);
        
        try {
          // Update quiz status to active first
          await db.update(quizzes)
            .set({ status: 'active' })
            .where(eq(quizzes.id, quiz.id));

          // Emit auto-start notification to all connected clients in quiz room
          const roomName = `quiz-${quiz.id}`;
          io.to(roomName).emit('quiz:auto-start', {
            quizId: quiz.id,
            title: quiz.title,
            message: 'Quiz is starting automatically...',
          });

          // Start live quiz orchestration (non-blocking)
          // The startLiveQuiz function will create session internally if needed
          startLiveQuiz(quiz.id).catch(async (err: Error) => {
            console.error(`Auto-start orchestration error for quiz ${quiz.id}:`, err);
            
            // Revert status back to draft so it can be retried
            try {
              await db.update(quizzes)
                .set({ status: 'draft' })
                .where(eq(quizzes.id, quiz.id));
              console.log(`Reverted quiz ${quiz.id} to draft for retry`);
            } catch (revertErr) {
              console.error(`Failed to revert quiz ${quiz.id} status:`, revertErr);
            }
          });

          console.log(`Successfully triggered auto-start for quiz ${quiz.id}`);
        } catch (err) {
          console.error(`Failed to auto-start quiz ${quiz.id}:`, err);
        }
      }
    } catch (error) {
      console.error('Auto-start scheduler error:', error);
    }
  }

  // Run auto-start check every 30 seconds
  setInterval(autoStartQuizzes, 30000);
  
  // Run immediately on startup
  autoStartQuizzes();

  // Initialize NPA automation scheduler
  initializeNPAScheduler();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
