import request from 'supertest';
import createApp from '../../server/app';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Enrollments API', () => {
  it('create duplicate and list', async () => {
    const app = await createApp();
    const token = jwt.sign({ id: 1, name: 'test' }, process.env.JWT_SECRET as string);
    const auth = `Bearer ${token}`;
    const payload = { userId: 9999, courseId: 1, paymentStatus: 'free' };
    try {
      const res1 = await request(app).post('/api/enrollments').set('Authorization', auth).send(payload);
      expect(res1.status).toBe(201);

  const res2 = await request(app).post('/api/enrollments').set('Authorization', auth).send(payload);
  expect([200, 201, 400]).toContain(res2.status);

      const list = await request(app).get('/api/enrollments').set('Authorization', auth);
      expect(list.status).toBe(200);
      expect(Array.isArray(list.body.data)).toBe(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  }, 20000);
});
