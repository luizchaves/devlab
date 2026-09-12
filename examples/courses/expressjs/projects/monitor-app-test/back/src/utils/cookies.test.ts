import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCookies } from '@/utils/cookies.ts';

/**
 * Funcao pura: recebe o cabecalho `Cookie` como string e devolve um objeto.
 * Nao precisa de servidor, de banco nem de navegador.
 */
describe('parseCookies', () => {
  it('separa pares por ponto e virgula e decodifica o valor', () => {
    assert.deepEqual(parseCookies('token=abc.def.ghi; theme=dark%20mode'), {
      token: 'abc.def.ghi',
      theme: 'dark mode',
    });
  });

  it('preserva o sinal de igual dentro do valor', () => {
    assert.deepEqual(parseCookies('token=a=b=c'), { token: 'a=b=c' });
  });

  it('devolve objeto vazio sem cabecalho', () => {
    assert.deepEqual(parseCookies(undefined), {});
    assert.deepEqual(parseCookies(''), {});
  });

  it('nao derruba a requisicao com percent-encoding invalido', () => {
    assert.deepEqual(parseCookies('bad=%E0%A4%A'), { bad: '%E0%A4%A' });
  });
});
