import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import ENV from './env';

export const pool = createPool(ENV.DATABASE_URL);
export const db = drizzle(pool);
export default db;

// During tests, ensure minimal tables required by middleware/tests exist.
if (process.env.NODE_ENV === 'test') {
	(async () => {
		let conn: any;
		try {
			// Acquire a dedicated connection for the DDL and release it immediately
			conn = await pool.getConnection();
			await conn.query(
				`CREATE TABLE IF NOT EXISTS api_logs (
					id INT AUTO_INCREMENT PRIMARY KEY,
					request_id VARCHAR(64),
					route VARCHAR(255),
					method VARCHAR(10),
					status INT,
					duration_ms INT,
					user_id INT,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				)`
			);
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const _loggerMod = require('../server/utils/logger');
			const logger = _loggerMod?.logger ?? _loggerMod?.default ?? _loggerMod;
			logger.debug({ err: e }, 'Test DB bootstrap: api_logs create failed');
		} finally {
			try {
				await conn?.release?.();
			} catch (_) {
				// ignore
			}
		}
	})();
}
