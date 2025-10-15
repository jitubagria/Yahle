import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import ENV from './env';

const pool = createPool(ENV.DATABASE_URL);
export const db = drizzle(pool);
export default db;
