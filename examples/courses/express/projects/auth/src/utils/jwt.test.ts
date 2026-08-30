import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { signJwt, verifyJwt } from '#utils/jwt.ts';

describe('signJwt', () => {
  it('gera um token com tres partes', () => {
    assert.equal(signJwt({ sub: '1' }).split('.').length, 3);
  });
});

describe('verifyJwt', () => {
  it('devolve o payload de um token valido', () => {
    const payload = verifyJwt(signJwt({ sub: '1', name: 'Ana' }));

    assert.equal(payload.sub, '1');
    assert.equal(payload.name, 'Ana');
  });

  it('rejeita um token adulterado', () => {
    const [header, , signature] = signJwt({ sub: '1' }).split('.');
    const forged = Buffer.from(JSON.stringify({ sub: '999' })).toString('base64url');

    assert.throws(() => verifyJwt(`${header}.${forged}.${signature}`));
  });

  it('rejeita um token expirado', () => {
    assert.throws(() => verifyJwt(signJwt({ sub: '1' }, -1)));
  });
});
