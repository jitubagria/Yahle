import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { eq, desc } from 'drizzle-orm';
import { insertAndFetch } from '../core/dbHelpers';
import { otps, bigtosMessages } from '../../drizzle/schema';
import { db } from '../db';
import { bigtosService } from '../bigtos';
import { getUserOrCreate, checkAndIncrementOtpRequest, isLocked, incrementVerifyAttempt, saveRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/authService';
import { signAccessToken, signRefreshToken, verifyToken } from '../core/jwt';
import { JWT_SECRET } from '../lib/env';
import logger from '../lib/logger';

const router = Router();

// No-op: logger silences output in test mode; keep original behavior

const LoginSchema = z.object({ mobileno: z.string().min(6) });
const VerifySchema = z.object({ mobileno: z.string().min(6), otp: z.string().length(6) });

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/login', async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload' });

  const { mobileno } = parsed.data;

  // deny if mobile locked due to failed verifies
  if (isLocked(mobileno)) return res.status(429).json({ success: false, message: 'Too many failed attempts, try later' });

  // rate limit OTP requests per mobileno
  if (!checkAndIncrementOtpRequest(mobileno)) return res.status(429).json({ success: false, message: 'Rate limit exceeded' });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await insertAndFetch(db, otps as any, { phone: mobileno, otp, expiresAt } as any);

  // expose last OTP in test environment for deterministic tests
  if (process.env.NODE_ENV === 'test') {
    try {
      (global as any).__LAST_OTP = { mobileno, otp, expiresAt };
    } catch (_e) {}
  }

  // --- OTP sending logic ---
  if (
    process.env.ALLOW_TEST_OTP_BYPASS === 'true' &&
    mobileno === '9999999999'
  ) {
    logger.info({ phone: mobileno, otp }, '[test-otp] Echo for 9999999999');
    return res.json({ success: true, message: 'OTP sent (test)', otp });
  }

  try {
    // bigtosService expects (mobileno, message)
    await bigtosService.sendText(mobileno, `Your verification code is: ${otp}`);
    try {
      await insertAndFetch(db, bigtosMessages as any, {
        mobile: mobileno,
        message: `Your verification code is: ${otp}`,
        type: 'Text',
        status: 'sent',
        createdAt: new Date().toISOString(),
      } as any);
    } catch (err) {
      logger.error({ err }, 'Failed to persist bigtos_messages audit');
    }
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    logger.error({ err }, 'Failed to send OTP');
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const parsed = VerifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload' });
  const { mobileno, otp } = parsed.data;

  // In test mode, prefer the in-memory OTP if present
  let latest: any = null;
  if (process.env.NODE_ENV === 'test' && (global as any).__LAST_OTP && (global as any).__LAST_OTP.mobileno === mobileno) {
    latest = (global as any).__LAST_OTP;
  } else {
    const rows = await db
      .select()
      .from(otps as any)
      .where(eq((otps as any).phone, mobileno))
      .orderBy(desc((otps as any).id))
      .limit(1);
    latest = rows && rows.length ? rows[0] : null;
  }

  if (!latest || String(latest.otp) !== otp || !latest.expiresAt || new Date(latest.expiresAt) < new Date()) {
    // increment attempts and possibly lock
    try { await incrementVerifyAttempt(mobileno); } catch (err) { logger.error({ err }, 'incrementVerifyAttempt failed'); }
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  // find or create user, then sign JWT with userId
  const user = await getUserOrCreate(mobileno);
  const payload = { userId: (user as any)?.id, mobileno };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // store refresh token in DB (expiresAt matches token expiry)
  const decodedRefresh: any = verifyToken(refreshToken, 'refresh');
  const expiresAt = new Date(decodedRefresh.exp * 1000).toISOString();
  try {
    await saveRefreshToken((user as any).id, refreshToken, expiresAt, req.headers['user-agent'] as string | undefined || null, req.ip || null);
  } catch (err) {
    logger.error({ err }, 'Failed to save refresh token');
  }

  return res.json({ success: true, user, accessToken, refreshToken });
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing refresh token' });

  try {
    const decoded: any = verifyToken(refreshToken, 'refresh');
    const userId = decoded.userId || decoded.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

    const ok = await verifyRefreshToken(userId, refreshToken);
    if (!ok) return res.status(401).json({ success: false, message: 'Refresh token revoked or invalid' });

    // issue new tokens (rotate refresh token)
    const payload = { userId, mobileno: decoded.mobileno || decoded.mobile || decoded.mobileNo };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

    // persist new refresh and revoke old one
    const decodedNew: any = verifyToken(newRefresh, 'refresh');
    const newExpires = new Date(decodedNew.exp * 1000).toISOString();
    try {
      await saveRefreshToken(userId, newRefresh, newExpires, req.headers['user-agent'] as string | undefined || null, req.ip || null);
      await revokeRefreshToken(userId, refreshToken);
    } catch (err) {
      logger.error({ err }, 'Failed rotating refresh tokens');
    }

    return res.json({ success: true, accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  const { userId, refreshToken } = req.body || {};
  if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });
  try {
    await revokeRefreshToken(userId, refreshToken);
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Failed to revoke refresh token');
    return res.status(500).json({ success: false, message: 'Failed to revoke' });
  }
});
export default router;

function maskPhone(p: string) {
  if (!p) return p;
  const s = String(p);
  if (s.length <= 4) return '****';
  return '****' + s.slice(-4);
}
