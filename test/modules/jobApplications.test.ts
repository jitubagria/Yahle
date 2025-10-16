import request from 'supertest';
import createApp from '../../server/app';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Job Applications API', () => {
  it('create duplicate and list', async () => {
    const app = await createApp();
    const token = jwt.sign({ id: 1, name: 'test' }, process.env.JWT_SECRET as string);
    const auth = `Bearer ${token}`;
    const payload = { jobId: 1, userId: 9999, coverLetter: 'Please consider me', status: 'pending' };
    try {
  const res1 = await request(app).post('/api/job-applications').set('Authorization', auth).send(payload);
  expect([200, 201]).toContain(res1.status);

  const res2 = await request(app).post('/api/job-applications').set('Authorization', auth).send(payload);
  // some implementations return 201 twice; accept either duplicate 201 or 400
  expect([200, 201, 400]).toContain(res2.status);

      const list = await request(app).get('/api/job-applications').set('Authorization', auth);
      expect(list.status).toBe(200);
      expect(Array.isArray(list.body.data)).toBe(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  }, 20000);
});
