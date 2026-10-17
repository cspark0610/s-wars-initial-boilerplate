import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp } from '../../test-app.factory';

describe('MoviesController (integration)', () => {
  let app: INestApplication;
  let adminToken: string;
  let movieId: string;

  beforeAll(async () => {
    app = await createTestingApp();

    await request(app.getHttpServer()).post('/v1/auth/sign-up').send({
      email: 'admin@example.com',
      password: 'Password123',
      role: 'ADMIN',
    });

    const loginResponse = await request(app.getHttpServer()).post('/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'Password123',
    });

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /v1/auth/sign-up should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send({
          email: 'user2@example.com',
          password: 'Password123',
          role: 'REGULAR',
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
    });

    it('POST /v1/auth/login should return a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Password123',
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
    });
  });

  describe('Movies', () => {
    it('POST /v1/movies should create a movie as admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'A New Hope',
          episodeId: 4,
          openingCrawl: 'It is a period of civil war...',
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          releaseDate: '1977-05-25',
          swapiUrl: 'https://www.swapi.tech/api/films/1',
        })
        .expect(201);

      movieId = response.body.id;
      expect(response.body.title).toBe('A New Hope');
      expect(response.body.episodeId).toBe(4);
    });

    it('GET /v1/movies should list movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });

    it('GET /v1/movies/:id should return movie detail', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(movieId);
    });

    it('PATCH /v1/movies/:id should update a movie', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'A New Hope (Updated)' })
        .expect(200);

      expect(response.body.title).toBe('A New Hope (Updated)');
    });

    it('DELETE /v1/movies/:id should remove a movie', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('SWAPI integration', () => {
    it('GET /v1/movies/swapi/3 should return film from SWAPI', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/movies/swapi/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.title).toBeDefined();
      expect(response.body.url).toContain('/films/3');
    });
  });
});
