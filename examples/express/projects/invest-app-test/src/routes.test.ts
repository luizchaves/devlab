import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '@/index.ts';

/** E-mail unico por execucao: rodar a suite duas vezes nao esbarra no @unique. */
function createValidUser() {
  const hash = randomBytes(20).toString('hex');

  return {
    name: `Valid ${hash}`,
    email: `valid-${hash}@email.com`,
    password: '12345678',
  };
}

async function loadToken(user: { email: string; password: string }) {
  const response = await request(app).post('/api/signin').send(user);

  return response.body.token as string;
}

describe('InvestApp', () => {
  let validUser: ReturnType<typeof createValidUser>;
  let token: string;
  let categoryId: string;

  before(async () => {
    validUser = createValidUser();

    await request(app).post('/api/users').send(validUser);

    token = await loadToken(validUser);

    const categories = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);

    categoryId = categories.body[0].id;
  });

  describe('POST /api/users', () => {
    it('cria um usuario', async () => {
      const response = await request(app).post('/api/users').send(createValidUser());

      assert.equal(response.statusCode, 201);
    });

    it('nao devolve a senha', async () => {
      const response = await request(app).post('/api/users').send(createValidUser());

      assert.equal(response.body.password, undefined);
    });

    it('recusa e-mail repetido', async () => {
      const response = await request(app).post('/api/users').send(validUser);

      assert.equal(response.statusCode, 409);
    });

    it('recusa e-mail invalido', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...createValidUser(), email: 'nao-e-email' });

      assert.equal(response.statusCode, 400);
    });
  });

  describe('POST /api/signin', () => {
    it('devolve token com credenciais validas', async () => {
      const response = await request(app).post('/api/signin').send(validUser);

      assert.equal(response.statusCode, 200);
      assert.ok(response.body.token);
    });

    it('recusa senha errada', async () => {
      const response = await request(app)
        .post('/api/signin')
        .send({ email: validUser.email, password: 'errada00' });

      assert.equal(response.statusCode, 401);
    });
  });

  describe('GET /api/investments', () => {
    it('exige token', async () => {
      const response = await request(app).get('/api/investments');

      assert.equal(response.statusCode, 401);
    });

    it('responde com token valido', async () => {
      const response = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /api/investments', () => {
    it('cria um investimento', async () => {
      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Tesouro Selic 2029',
          value: 100000,
          interest: '100% Selic',
          categoryId,
          broker: 'Banco Inter',
        });

      assert.equal(response.statusCode, 201);
      assert.equal(response.body.category.id, categoryId);
      assert.equal(response.body.broker.name, 'Banco Inter');
    });

    it('recusa corpo invalido', async () => {
      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'x', value: -1 });

      assert.equal(response.statusCode, 400);
    });

    it('recusa id de rota que nao e UUID', async () => {
      const response = await request(app)
        .get('/api/investments/nao-e-uuid')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 400);
    });
  });

  describe('isolamento por dono', () => {
    it('nao mostra o investimento de outro usuario', async () => {
      const created = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Somente do dono',
          value: 5000,
          interest: '110% CDI',
          categoryId,
          broker: 'XP',
        });

      const otherUser = createValidUser();
      await request(app).post('/api/users').send(otherUser);
      const otherToken = await loadToken(otherUser);

      const response = await request(app)
        .get(`/api/investments/${created.body.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 404);
    });
  });
});
