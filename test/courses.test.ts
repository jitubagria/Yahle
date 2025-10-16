import request from 'supertest';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';

jest.mock('../server/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [{ id: 1, title: 'Intro to X', description: 'desc' }],
        }),
      }),
    }),
  },
}));

import createApp from '../server/app';

describe('Courses endpoints', () => {
  let instance: any;
  beforeAll(async () => {
    instance = await createApp();
  });

  it('GET /api/courses returns list', async () => {
    const res = await request(instance).get('/api/courses');
    expect(res.status).toBe(200);
    // new API returns { success: true, data: [] }
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
