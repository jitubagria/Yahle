import jwt, { Secret } from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } from '../lib/env';
import logger from '../lib/logger';

if (!JWT_SECRET) {
  if (NODE_ENV === 'production') throw new Error('JWT_SECRET missing');
  logger.warn('[jwt] JWT_SECRET missing, using dev behavior');
}
if (!JWT_REFRESH_SECRET) {
  if (NODE_ENV === 'production') throw new Error('JWT_REFRESH_SECRET missing');
  logger.warn('[jwt] JWT_REFRESH_SECRET missing, falling back to JWT_SECRET');
}

const REFRESH_SECRET = JWT_REFRESH_SECRET || JWT_SECRET;

export type TokenType = 'access' | 'refresh';

export function signAccessToken(payload: object) {
  return jwt.sign({ ...payload, type: 'access' } as any, JWT_SECRET as Secret, { expiresIn: '15m' });
}

export function signRefreshToken(payload: object) {
  return jwt.sign({ ...payload, type: 'refresh' } as any, REFRESH_SECRET as Secret, { expiresIn: '30d' });
}

export function verifyToken(token: string, type: TokenType = 'access') {
  try {
    const secret = type === 'access' ? JWT_SECRET : REFRESH_SECRET;
    const decoded = jwt.verify(token, secret as Secret) as any;
    if (decoded.type && decoded.type !== type) throw new Error('Invalid token type');
    return decoded as any;
  } catch (err) {
    throw err;
  }
}

export default { signAccessToken, signRefreshToken, verifyToken };
