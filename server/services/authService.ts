import { db } from '../db';
import { users, otps, userSessions } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { insertAndFetch } from '../core/dbHelpers';
import crypto from 'crypto';

// In-memory rate limiter maps keyed by mobileno.
// NOTE: In production consider Redis for cross-instance limits.
const otpRequestCounts = new Map<string, { count: number; windowStart: number }>();
const lockedMobiles = new Map<string, number>(); // mobileno -> lock expiry ms

const OTP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const OTP_MAX_PER_WINDOW = 3;
const VERIFY_MAX_FAILED = 5;
const VERIFY_LOCK_MS = 10 * 60 * 1000; // 10 minutes

// Find a user by phone, or create one. Returns the user row.
export async function getUserOrCreate(mobileno: string) {
  const [existing] = await db.select().from(users).where(eq(users.phone, mobileno)).limit(1);
  if (existing) return existing;

  const created = await insertAndFetch(db, users as any, {
    phone: mobileno,
    isVerified: 1,
  } as any);
  return created;
}

export function checkAndIncrementOtpRequest(mobileno: string): boolean {
  const now = Date.now();
  const entry = otpRequestCounts.get(mobileno);
  if (!entry || now - entry.windowStart > OTP_WINDOW_MS) {
    otpRequestCounts.set(mobileno, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= OTP_MAX_PER_WINDOW) return false;
  entry.count += 1;
  otpRequestCounts.set(mobileno, entry);
  return true;
}

export function isLocked(mobileno: string): boolean {
  const until = lockedMobiles.get(mobileno);
  if (!until) return false;
  if (Date.now() > until) {
    lockedMobiles.delete(mobileno);
    return false;
  }
  return true;
}

export async function incrementVerifyAttempt(mobileno: string): Promise<{ attempts: number; locked: boolean }> {
  // find latest OTP row and increment attempts
  const [latest]: any = await db.select().from(otps).where(eq(otps.phone, mobileno)).orderBy(eq(otps.id, otps.id)).limit(1);
  if (!latest) return { attempts: 0, locked: false };

  const newAttempts = (latest.attempts ?? 0) + 1;
  await db.update(otps).set({ attempts: newAttempts }).where(eq(otps.id, latest.id)).execute?.();

  if (newAttempts > VERIFY_MAX_FAILED) {
    lockedMobiles.set(mobileno, Date.now() + VERIFY_LOCK_MS);
    return { attempts: newAttempts, locked: true };
  }
  return { attempts: newAttempts, locked: false };
}

// Persist refresh token associated with a user session
export async function saveRefreshToken(userId: number, token: string, expiresAt: string, device?: string | null, ip?: string | null) {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  await insertAndFetch(db, userSessions as any, {
    userId,
    refreshToken: hash,
    device: device ?? null,
    ip: ip ?? null,
    expiresAt,
    isActive: 1,
  } as any);
}

export async function verifyRefreshToken(userId: number, token: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const rows = await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.userId, userId), eq(userSessions.refreshToken, hash), eq(userSessions.isActive, 1)));
  return rows.length > 0;
}

export async function revokeRefreshToken(userId: number, token?: string) {
  if (token) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await db
      .update(userSessions)
      .set({ isActive: 0 })
      .where(and(eq(userSessions.userId, userId), eq(userSessions.refreshToken, hash)))
      .execute?.();
    return;
  }
  await db.update(userSessions).set({ isActive: 0 }).where(eq(userSessions.userId, userId)).execute?.();
}

export default { getUserOrCreate, checkAndIncrementOtpRequest, isLocked, incrementVerifyAttempt, saveRefreshToken, verifyRefreshToken, revokeRefreshToken };
