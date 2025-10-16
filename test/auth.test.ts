/**
 * Auth flow tests using Supertest. Mocks DB and external services so tests run in-memory.
 */
import request from 'supertest';

// Ensure refresh secret exists for jwt helper
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.NODE_ENV = 'test';
process.env.USE_CLEAN_ROUTES = '1';

// Mocks must be declared before importing app so modules are hoisted
const lastOtpByPhone: Record<string, any> = {};
const tokenStore = new Map<string, { userId: number; active: boolean }>();

jest.mock('../server/core/dbHelpers', () => ({
  insertAndFetch: async (_db: any, table: any, values: any) => {
    // when inserting into otps table, record the OTP so verify endpoint can read it
    try {
      if (table && (table.name === 'otps' || (table?.tableName === 'otps'))) {
        const phone = values.phone || values.mobile || values.mobileno || values.mobileNo;
        const row = { id: 1, ...values };
        lastOtpByPhone[phone] = row;
        return row;
      }
    } catch (_) {}
    return { id: 1, ...values };
  },
}));

jest.mock('../server/services/authService', () => {
  return {
    getUserOrCreate: async (mobileno: string) => ({ id: 1, phone: mobileno }),
    checkAndIncrementOtpRequest: (_: string) => true,
    isLocked: (_: string) => false,
    incrementVerifyAttempt: async (_: string) => ({ attempts: 0, locked: false }),
    saveRefreshToken: async (userId: number, token: string) => {
      tokenStore.set(token, { userId, active: true });
    },
    verifyRefreshToken: async (userId: number, token: string) => {
      const rec = tokenStore.get(token);
      return !!rec && rec.userId === userId && rec.active === true;
    },
    revokeRefreshToken: async (userId: number, token?: string) => {
      if (token) {
        const rec = tokenStore.get(token);
        if (rec && rec.userId === userId) rec.active = false;
        tokenStore.set(token, rec as any);
        return;
      }
      // revoke all for user
      for (const [t, rec] of tokenStore.entries()) if (rec.userId === userId) tokenStore.set(t, { ...rec, active: false });
    },
  };
});

jest.mock('../server/bigtos', () => ({
  bigtosService: {
    sendText: async (_mobileno: string | string[], _msg: string) => ({ stub: true }),
  },
}));

// Mock simple db.select chain for reading otps.latest
jest.mock('../server/db', () => ({
  db: {
    select: () => ({
      from: (_table: any) => ({
        where: (_cond: any) => ({
          orderBy: (_o: any) => ({
            limit: async (n: number) => {
              // try to extract phone from where cond (crudely)
              // In our usage we rely on lastOtpByPhone populated in insertAndFetch mock
              const phones = Object.keys(lastOtpByPhone);
              if (!phones.length) return [];
              const phone = phones[phones.length - 1];
              return [lastOtpByPhone[phone]];
            },
          }),
        }),
      }),
    }),
  },
}));

import createApp from '../server/app';

describe('Auth endpoints', () => {
  const mobileno = '9999999999';
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let instance: any;

  beforeAll(async () => {
    instance = await createApp();
  });

  it('POST /api/auth/login should send OTP', async () => {
    const res = await request(instance).post('/api/auth/login').send({ mobileno });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('OTP sent (test)');
    // capture OTP echoed in test mode and populate global LAST_OTP for server verify path
    (global as any).__TEST_OTP = res.body.otp;
    try {
      (global as any).__LAST_OTP = { mobileno, otp: res.body.otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() };
    } catch (_e) {}
  });

  it('POST /api/auth/verify should return tokens', async () => {
    // read OTP from mock store
  const otpValue = (global as any).__TEST_OTP || '000000';
  const res = await request(instance).post('/api/auth/verify').send({ mobileno, otp: String(otpValue) });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('POST /api/auth/refresh should rotate tokens and return new ones', async () => {
  const res = await request(instance).post('/api/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    // old refresh token should be deactivated by our mocked revoke
    const oldActive = await (await import('../server/services/authService')).verifyRefreshToken(1, refreshToken as string);
    expect(oldActive).toBe(false);
    // update tokens
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('POST /api/auth/logout should revoke provided token', async () => {
    // call logout with userId and refreshToken
  const res = await request(instance).post('/api/auth/logout').send({ userId: 1, refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const stillActive = await (await import('../server/services/authService')).verifyRefreshToken(1, refreshToken as string);
    expect(stillActive).toBe(false);
  });
});

afterAll(async () => {
  // give Jest a chance to close any open handles from libs
  await new Promise((r) => setTimeout(r, 100));
});
