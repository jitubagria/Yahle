import { mysqlTable, int, varchar, datetime, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";


export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  difficulty: varchar("difficulty", { length: 50 }),
  type: varchar("type", { length: 50 }),
  totalQuestions: int("total_questions"),
  questionTime: int("question_time"),
  duration: int("duration"),
  passingScore: int("passing_score"),
  entryFee: int("entry_fee"),
  rewardInfo: text("reward_info"),
  certificateType: varchar("certificate_type", { length: 100 }),
  startTime: datetime("start_time"),
  endTime: datetime("end_time"),
  status: varchar("status", { length: 50 }),

  // ✅ MySQL-compatible defaults:
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});
