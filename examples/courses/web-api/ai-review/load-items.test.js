import assert from 'node:assert/strict';
import { test } from 'node:test';

// IMPL=generated executa os mesmos testes contra a versão gerada pelo assistente.
const modulePath =
  process.env.IMPL === 'generated' ? './load-items.generated.js' : './load-items.js';

const { loadItems } = await import(modulePath);

// Servidor falso: devolve a lista em 200 e um objeto de erro em 500,
// exatamente como uma API real responderia.
function fakeFetch(status, body) {
  return async () => new Response(JSON.stringify(body), { status });
}

const okResponse = fakeFetch(200, [{ name: 'CDB' }, { name: 'Tesouro Selic' }]);
const errorResponse = fakeFetch(500, { message: 'Internal Server Error' });

test('devolve os nomes quando a API responde 200', async () => {
  assert.deepEqual(await loadItems('/api/items', okResponse), ['CDB', 'Tesouro Selic']);
});

test('falha citando o status quando a API responde 500', async () => {
  await assert.rejects(() => loadItems('/api/items', errorResponse), /HTTP 500/);
});
