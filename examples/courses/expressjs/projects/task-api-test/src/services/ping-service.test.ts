import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parsePing } from '#services/ping-service.ts';

// #region unit
/**
 * A extracao do texto e a unica parte do ping que vale testar em unidade: ela
 * e pura, e o formato varia entre sistemas.
 */
describe('parsePing', () => {
  it('extrai a latencia do formato do Linux', () => {
    const saida = '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.3 ms';

    assert.deepEqual(parsePing(saida), { latencyMs: 12.3 });
  });

  it('extrai a latencia do formato com menor-que', () => {
    const saida = 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128';

    assert.deepEqual(parsePing(saida), { latencyMs: 1 });
  });

  it('devolve null quando nao ha latencia na saida', () => {
    assert.deepEqual(parsePing('Request timeout for icmp_seq 0'), { latencyMs: null });
  });
});
// #endregion
