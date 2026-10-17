import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../integration/test-app.factory';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 401 for protected endpoints without token', async () => {
    const response = await request(app.getHttpServer()).get('/v1/movies');
    expect(response.status).toBe(401);
  });

  it('should allow public sign-up', async () => {
    const response = await request(app.getHttpServer()).post('/v1/auth/sign-up').send({
      email: 'e2e@example.com',
      password: 'Password123',
      role: 'REGULAR',
    });

    expect(response.status).toBe(201);
    expect(response.body.access_token).toBeDefined();
  });
});
