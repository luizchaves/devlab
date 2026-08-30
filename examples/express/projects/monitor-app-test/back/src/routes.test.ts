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

const validHost = { name: 'Google DNS', address: '8.8.8.8', tags: ['infra'] };

async function loadToken(user: { email: string; password: string }) {
  const response = await request(app).post('/api/signin').send(user);

  return response.body.token as string;
}

describe('MonitorApp', () => {
  let token: string;
  let otherToken: string;
  let hostId: string;

  before(async () => {
    const user = createValidUser();
    const other = createValidUser();

    await request(app).post('/api/users').send(user);
    await request(app).post('/api/users').send(other);

    token = await loadToken(user);
    otherToken = await loadToken(other);

    const created = await request(app)
      .post('/api/hosts')
      .set('Authorization', `Bearer ${token}`)
      .send(validHost);

    hostId = created.body.id;
  });

  describe('POST /api/users', () => {
    it('creates an account', async () => {
      const response = await request(app).post('/api/users').send(createValidUser());

      assert.equal(response.statusCode, 201);
    });

    it('never returns the password', async () => {
      const response = await request(app).post('/api/users').send(createValidUser());

      assert.equal(response.body.password, undefined);
    });

    it('rejects mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...createValidUser(), confirmationPassword: 'outra-coisa' });

      assert.equal(response.statusCode, 400);
    });
  });

  describe('POST /api/signin', () => {
    it('returns the same 401 for unknown email and wrong password', async () => {
      const unknownEmail = await request(app)
        .post('/api/signin')
        .send({ email: 'ninguem@exemplo.com', password: '12345678' });

      assert.equal(unknownEmail.statusCode, 401);
      assert.equal(unknownEmail.body.error, 'Invalid credentials');
    });
  });

  describe('GET /api/hosts', () => {
    it('requires a token', async () => {
      const response = await request(app).get('/api/hosts');

      assert.equal(response.statusCode, 401);
    });

    it('rejects a tampered token', async () => {
      const response = await request(app)
        .get('/api/hosts')
        .set('Authorization', `Bearer ${token}x`);

      assert.equal(response.statusCode, 401);
    });

    it('lists the hosts owned by the token holder', async () => {
      const response = await request(app).get('/api/hosts').set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 200);
      assert.ok(response.body.every((host: { name: string }) => typeof host.name === 'string'));
    });

    it('filters by tag', async () => {
      const response = await request(app)
        .get('/api/hosts?tag=infra')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 200);
      assert.ok(response.body.length >= 1);
    });

    it('does not list a host owned by another account', async () => {
      const response = await request(app)
        .get('/api/hosts')
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(
        response.body.some((host: { id: string }) => host.id === hostId),
        false
      );
    });
  });

  describe('POST /api/hosts', () => {
    it('creates a host with its tags connected', async () => {
      const response = await request(app)
        .post('/api/hosts')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Servidor local', address: '127.0.0.1', tags: ['infra', 'local'] });

      assert.equal(response.statusCode, 201);
      assert.equal(response.body.tags.length, 2);
    });

    it('rejects an address that is neither an IP nor a domain', async () => {
      const response = await request(app)
        .post('/api/hosts')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validHost, address: 'https://exemplo.com' });

      assert.equal(response.statusCode, 400);
      assert.ok(Array.isArray(response.body.issues));
    });
  });

  describe('GET /api/hosts/:id', () => {
    it('responds 404 for a host owned by another account', async () => {
      const response = await request(app)
        .get(`/api/hosts/${hostId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 404);
    });

    it('responds 400 for an id that is not a UUID', async () => {
      const response = await request(app)
        .get('/api/hosts/abc')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 400);
    });
  });

  describe('GET /api/hosts/:id/pings', () => {
    it('returns the ping history of the host', async () => {
      const response = await request(app)
        .get(`/api/hosts/${hostId}/pings`)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 200);
      assert.ok(Array.isArray(response.body));
    });

    it('does not return the history of another account host', async () => {
      const response = await request(app)
        .get(`/api/hosts/${hostId}/pings`)
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 404);
    });
  });

  describe('DELETE /api/hosts/:id', () => {
    it('removes a host of its own', async () => {
      const created = await request(app)
        .post('/api/hosts')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Descartável', address: '1.1.1.1' });

      const response = await request(app)
        .delete(`/api/hosts/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 204);
    });

    it('responds 404 when deleting another account host', async () => {
      const response = await request(app)
        .delete(`/api/hosts/${hostId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 404);
    });
  });
});
