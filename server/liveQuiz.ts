import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from './db';
import { quizzes, quizQuestions, quizSessions, quizResponses, quizLeaderboard, users } from '../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';
import { QuizSessionStatus } from './enums';
import { insertAndFetch } from './core/dbHelpers';
import logger from './lib/logger';

interface QuizSession {
  quizId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionTime: number;
  isRunning: boolean;
  participants: Set<number>;
}

const activeSessions = new Map<number, QuizSession>();

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : '*',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Client connected');

    // Join quiz room
    socket.on('quiz:join', async (data: { quizId: number; userId: number }) => {
      const { quizId, userId } = data;
      const roomName = `quiz-${quizId}`;
      
  socket.join(roomName);
  logger.info({ userId, quizId }, `User ${userId} joined quiz ${quizId}`);

      // Add to participants
      let session = activeSessions.get(quizId);
      if (!session) {
        // Create session if doesn't exist
        const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
        const questions = await db.select().from(quizQuestions)
          .where(eq(quizQuestions.quizId, quizId))
          .orderBy(quizQuestions.orderIndex);

        session = {
          quizId,
          currentQuestionIndex: -1, // -1 means countdown phase
          totalQuestions: questions.length,
          questionTime: quiz?.questionTime || 10,
          isRunning: false,
          participants: new Set(),
        };
        activeSessions.set(quizId, session);
      }

      session.participants.add(userId);

      // Send current state
      if (session.isRunning && session.currentQuestionIndex >= 0) {
        const questions = await db.select().from(quizQuestions)
          .where(eq(quizQuestions.quizId, quizId))
          .orderBy(quizQuestions.orderIndex);
        
        const currentQuestion = questions[session.currentQuestionIndex];
        if (currentQuestion) {
          socket.emit('quiz:sync', {
            phase: 'question',
            question: currentQuestion,
            questionNumber: session.currentQuestionIndex + 1,
            totalQuestions: session.totalQuestions,
          });
        }
      }

      // Notify others
      socket.to(roomName).emit('quiz:participant-joined', { 
        userId, 
        participantCount: session.participants.size 
      });
    });

    // Submit answer
    socket.on('quiz:submit-answer', async (data: { 
      quizId: number; 
      questionId: number; 
      userId: number; 
      selectedOption: string; 
      timeTaken: number; 
    }) => {
      const { quizId, questionId, userId, selectedOption, timeTaken } = data;

      // Get question to check correct answer
      const [question] = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.id, questionId))
        .limit(1);

      if (!question) return;

      const isCorrect = question.correctOption === selectedOption;
      const baseScore = question.marks || 1;
      const session = activeSessions.get(quizId);
      const questionTime = session?.questionTime || 10;
      
      // Speed bonus: faster answers get more points
      const speedBonus = Math.max(0, Math.floor((questionTime - timeTaken) / 2));
      const score = isCorrect ? baseScore + speedBonus : 0;

      // Save response (MySQL-safe: use INSERT ... ON DUPLICATE KEY UPDATE)
      await db.execute(sql`
        INSERT INTO quiz_responses (quiz_id, user_id, question_id, selected_option, is_correct, response_time, score, created_at)
        VALUES (${quizId}, ${userId}, ${questionId}, ${selectedOption}, ${isCorrect}, ${timeTaken}, ${score}, NOW())
        ON DUPLICATE KEY UPDATE
          selected_option = VALUES(selected_option),
          is_correct = VALUES(is_correct),
          response_time = VALUES(response_time),
          score = VALUES(score);
      `);

      // Update leaderboard
      // Upsert leaderboard (MySQL): add to total_score on duplicate key
      await db.execute(sql`
        INSERT INTO quiz_leaderboard (quiz_id, user_id, total_score, rank)
        VALUES (${quizId}, ${userId}, ${score}, 0)
        ON DUPLICATE KEY UPDATE total_score = total_score + VALUES(total_score)
      `);

  logger.info({ userId, questionId, isCorrect, score }, `User ${userId} answered Q${questionId}: ${isCorrect ? 'Correct' : 'Wrong'} (+${score} points)`);
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected');
    });
  });

  // Start quiz orchestration
  async function startLiveQuiz(quizId: number) {
    const roomName = `quiz-${quizId}`;
    let session = activeSessions.get(quizId);
    
    // Create session if it doesn't exist (for auto-start scenarios)
    if (!session) {
      const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId))
        .orderBy(quizQuestions.orderIndex);

      session = {
        quizId,
        currentQuestionIndex: -1,
        totalQuestions: questions.length,
        questionTime: quiz?.questionTime || 10,
        isRunning: false,
        participants: new Set(),
      };
      activeSessions.set(quizId, session);
    }

    if (session.isRunning) return;

    session.isRunning = true;

    try {
      // Get quiz and questions
      const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      const questions = await db.select().from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId))
        .orderBy(quizQuestions.orderIndex);

      // Update quiz session in DB (use insertAndFetch to get row back)
      await insertAndFetch(db, quizSessions, {
        quizId,
        currentQuestion: 0,
        startedAt: new Date(),
        status: QuizSessionStatus.RUNNING as any,
      } as any);

      const questionTime = quiz?.questionTime || 10;
      const leaderboardDelay = 7; // seconds to show leaderboard

      // Countdown phase - preload first question
      io.to(roomName).emit('quiz:countdown', {
        seconds: 10,
        message: 'Quiz starting soon...',
      });

      // Preload first question during countdown
      if (questions[0]) {
        setTimeout(() => {
          io.to(roomName).emit('quiz:preload', { 
            question: questions[0],
            questionNumber: 1,
            totalQuestions: questions.length,
          });
        }, 3000); // Preload 3 seconds into countdown
      }

      await sleep(10000); // 10-second countdown

      // Question loop
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        session.currentQuestionIndex = i;

        // Show question
        io.to(roomName).emit('quiz:question', {
          question,
          questionNumber: i + 1,
          totalQuestions: questions.length,
          timeLimit: questionTime,
        });

        // Wait for question time
        await sleep(questionTime * 1000);

        // Auto-timeout
        io.to(roomName).emit('quiz:timeout', { questionId: question.id });

        // Calculate and show leaderboard
        await recalculateRanks(quizId);
        const leaderboard = await getLeaderboard(quizId);

        io.to(roomName).emit('quiz:leaderboard', {
          leaderboard,
          topText: `Top Performers after Question ${i + 1}`,
          questionNumber: i + 1,
        });

        // Preload next question while showing leaderboard
        if (questions[i + 1]) {
          setTimeout(() => {
            io.to(roomName).emit('quiz:preload', {
              question: questions[i + 1],
              questionNumber: i + 2,
              totalQuestions: questions.length,
            });
          }, 2000); // Preload 2 seconds into leaderboard
        }

        // Wait for leaderboard display
        await sleep(leaderboardDelay * 1000);
      }

      // Quiz ended
      const finalLeaderboard = await getLeaderboard(quizId);
      io.to(roomName).emit('quiz:end', {
        leaderboard: finalLeaderboard,
        totalQuestions: questions.length,
      });

      // Update session status
      await db.execute(sql`
        UPDATE quiz_sessions 
        SET status = ${'completed'}
        WHERE quiz_id = ${quizId}
      `);
    } finally {
      // Always cleanup session state, even on errors
      session.isRunning = false;
      activeSessions.delete(quizId);
    }
  }

  // Helper functions
  async function recalculateRanks(quizId: number) {
    await db.execute(sql`
      WITH ranked_scores AS (
        SELECT 
          user_id,
          total_score,
          RANK() OVER (ORDER BY total_score DESC) as new_rank
        FROM quiz_leaderboard
        WHERE quiz_id = ${quizId}
      )
      UPDATE quiz_leaderboard
      SET rank = ranked_scores.new_rank
      FROM ranked_scores
      WHERE quiz_leaderboard.user_id = ranked_scores.user_id
        AND quiz_leaderboard.quiz_id = ${quizId}
    `);
  }

  async function getLeaderboard(quizId: number) {
    const result = await db.select({
      userId: quizLeaderboard.userId,
      totalScore: quizLeaderboard.totalScore,
      rank: quizLeaderboard.rank,
    })
      .from(quizLeaderboard)
      .where(eq(quizLeaderboard.quizId, quizId))
      .orderBy(quizLeaderboard.rank)
      .limit(10);

    return result;
  }

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Expose start function
  return {
    io,
    startLiveQuiz,
  };
}
