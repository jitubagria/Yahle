import request from 'supertest';
import createApp from '../server/app';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';

describe('Health route', () => {
  it('should return status ok', async () => {
    const app = await createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  }, 10000);
});

afterAll(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});
