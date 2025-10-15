import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: 5,
});

export const db = drizzle(pool);

// optional helper for raw SQL
export const query = async (sql: string, params?: any[]) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};
