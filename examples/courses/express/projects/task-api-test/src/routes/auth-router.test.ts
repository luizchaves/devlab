import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';

import app from '#app.ts';
import { prisma } from '#database/prisma.ts';
import { resetRateLimit } from '#middlewares/rate-limit.ts';

const credenciais = { email: 'teste-auth@example.com', password: 'senha-de-desenvolvimento' };

// #region setup
/**
 * O teste importa `app`, e nao `server`: nenhuma porta e aberta.
 *
 * O `supertest` sobe um servidor efemero para cada chamada, o que permite
 * rodar as suites em paralelo sem conflito de porta.
 */
describe('POST /auth/signup', () => {
  before(async () => {
    resetRateLimit();
    await prisma.user.deleteMany({ where: { email: credenciais.email } });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: credenciais.email } });
  });
  // #endregion

  // #region cases
  it('cria a conta e nao devolve a senha', async () => {
    const { body, status } = await request(app)
      .post('/auth/signup')
      .send({ name: 'Teste', ...credenciais });

    assert.equal(status, 201);
    assert.equal(body.email, credenciais.email);
    // O que mais importa neste teste: a senha nao pode estar na resposta.
    assert.equal('password' in body, false);
  });

  it('recusa o mesmo e-mail duas vezes', async () => {
    const { status } = await request(app)
      .post('/auth/signup')
      .send({ name: 'Teste', ...credenciais });

    assert.equal(status, 409);
  });

  it('recusa senha curta com 422 e diz qual campo falhou', async () => {
    const { body, status } = await request(app)
      .post('/auth/signup')
      .send({ name: 'Curta', email: 'curta@example.com', password: '123' });

    assert.equal(status, 422);
    assert.deepEqual(body.error.issues[0].path, ['body', 'password']);
  });
  // #endregion
});

// #region signin
describe('POST /auth/signin', () => {
  it('responde a mesma coisa para senha errada e e-mail inexistente', async () => {
    const senhaErrada = await request(app)
      .post('/auth/signin')
      .send({ email: 'ana@example.com', password: 'errada' });

    const naoExiste = await request(app)
      .post('/auth/signin')
      .send({ email: 'ninguem@example.com', password: 'errada' });

    assert.equal(senhaErrada.status, 401);
    assert.equal(naoExiste.status, 401);
    // Mensagens diferentes entregariam a lista de e-mails cadastrados.
    assert.equal(senhaErrada.body.error.message, naoExiste.body.error.message);
  });
});
// #endregion
