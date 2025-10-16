import crypto from 'crypto';

export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const DATABASE_URL = process.env.DATABASE_URL ?? '';
export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '';
export const BIGTOS_KEY = process.env.BIGTOS_KEY ?? '';

// audit .env at startup; in production be strict
function auditEnv() {
  const missing: string[] = [];
  if (!DATABASE_URL) missing.push('DATABASE_URL');
  if (!JWT_SECRET) missing.push('JWT_SECRET');
  if (!JWT_REFRESH_SECRET) missing.push('JWT_REFRESH_SECRET');

  if (missing.length) {
    const msg = `Missing required env keys: ${missing.join(', ')}`;
    if (NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      // avoid importing logger at module-eval time to keep env lightweight
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const logger = require('./logger').default;
      logger.warn('[env audit] ' + msg);
    }
  }

  if (JWT_SECRET && JWT_REFRESH_SECRET && JWT_SECRET === JWT_REFRESH_SECRET) {
    const msg = 'JWT_SECRET and JWT_REFRESH_SECRET must be different';
    if (NODE_ENV === 'production') throw new Error(msg);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('./logger').default;
    logger.warn('[env audit] ' + msg);
  }
}

auditEnv();

const ENV = {
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  BIGTOS_KEY,
};

export default ENV;
