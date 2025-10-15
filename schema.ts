import { mysqlTable, serial, varchar, boolean, datetime, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

// USERS TABLE
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }), // made unique via index below
  email: varchar("email", { length: 255 }),
  otpCode: varchar("otp_code", { length: 10 }),
  otpExpiry: datetime("otp_expiry"),
  isVerified: boolean("is_verified").default(false),
  imageUrl: varchar("image_url", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  // Use a MySQL-compatible default that updates on row modification
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  phoneIdx: uniqueIndex("idx_users_phone").on(table.phone), // ✅ DB-level enforcement
}));

export type User = InferModel<typeof users>;
