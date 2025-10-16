import request from 'supertest';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';

import createApp from '../server/app';

describe('Quizzes endpoints', () => {
  let instance: any;
  beforeAll(async () => {
    instance = await createApp();
  });

  it('GET /api/quizzes responds', async () => {
    const res = await request(instance).get('/api/quizzes');
    expect([200, 404]).toContain(res.status);
  });
});
