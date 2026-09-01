import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import request from 'supertest';

import app from '#app.ts';
import { resetRateLimit } from '#middlewares/rate-limit.ts';

const senha = 'senha-de-desenvolvimento';

async function tokenDe(email: string): Promise<string> {
  const { body } = await request(app).post('/auth/signin').send({ email, password: senha });

  return body.token;
}

// #region isolation
/**
 * O teste que importa de verdade nesta aula: uma pessoa nunca alcanca a tarefa
 * de outra. E uma regra de seguranca, e regra de seguranca sem teste e
 * esperanca.
 */
describe('isolamento por dono em /tasks', () => {
  let ana = '';
  let bruno = '';

  before(async () => {
    resetRateLimit();
    ana = await tokenDe('ana@example.com');
    bruno = await tokenDe('bruno@example.com');
  });

  it('cada um ve apenas as proprias tarefas', async () => {
    const listaAna = await request(app).get('/tasks').set('Authorization', `Bearer ${ana}`);
    const listaBruno = await request(app).get('/tasks').set('Authorization', `Bearer ${bruno}`);

    const idsAna = listaAna.body.data.map((task: { id: number }) => task.id);
    const idsBruno = listaBruno.body.data.map((task: { id: number }) => task.id);

    assert.equal(idsAna.some((id: number) => idsBruno.includes(id)), false);
  });

  it('a tarefa de outra pessoa responde 404, e nao 403', async () => {
    const { body } = await request(app).get('/tasks').set('Authorization', `Bearer ${bruno}`);
    const idDoBruno = body.data[0].id;

    const { status } = await request(app)
      .get(`/tasks/${idDoBruno}`)
      .set('Authorization', `Bearer ${ana}`);

    // 403 confirmaria que o id existe e permitiria enumerar a base.
    assert.equal(status, 404);
  });
});
// #endregion

// #region guards
describe('protecoes de /tasks', () => {
  it('exige token', async () => {
    assert.equal((await request(app).get('/tasks')).status, 401);
  });

  it('recusa token adulterado', async () => {
    const { status } = await request(app)
      .get('/tasks')
      .set('Authorization', 'Bearer nao.e.um.token');

    assert.equal(status, 401);
  });

  it('recusa campo nao declarado no corpo', async () => {
    const token = await tokenDe('ana@example.com');

    const { status } = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Com campo extra', hacker: 1 });

    assert.equal(status, 422);
  });
});
// #endregion
