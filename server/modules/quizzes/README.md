# Quizzes Module

**Purpose:**
Quiz management, leaderboard, and certificate generation.

**Key Tables:**
- quizzes
- quiz_questions
- quiz_sessions
- quiz_responses
- quiz_leaderboard
- quiz_attempts

**Key Routes:**
- GET /api/quizzes
- POST /api/quizzes
- GET /api/quizzes/:id
- PUT /api/quizzes/:id
- DELETE /api/quizzes/:id

**Dependencies:**
- Drizzle ORM
- JWT

**Next Tasks:**
- Implement leaderboard logic
- Add certificate generation
- Add tests
