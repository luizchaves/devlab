import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ping } from '@/lib/ping.ts';

describe('ping', () => {
  it('returns a failure for an address that does not resolve', async () => {
    const result = await ping('host-que-nao-existe.invalid', 1);

    assert.equal(result.success, false);
    assert.equal(result.latency, null);
  });

  it('does not interpret the address as a shell command', async () => {
    // Com `exec` isto abriria um shell. Com `execFile` e apenas um argumento
    // invalido, e o `ping` falha sem executar nada.
    const result = await ping('8.8.8.8; echo comprometido', 1);

    assert.equal(result.success, false);
  });

  it('measures the loopback successfully', async () => {
    const result = await ping('127.0.0.1', 2);

    assert.equal(result.success, true);
    assert.equal(typeof result.latency, 'number');
  });
});
