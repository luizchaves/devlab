import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hashPassword, verifyPassword } from '#utils/password.ts';

describe('hashPassword', () => {
  it('produz hashes diferentes para a mesma senha', () => {
    // O sal aleatorio e o que impede rainbow tables e revela senhas iguais.
    assert.notEqual(hashPassword('senha-secreta'), hashPassword('senha-secreta'));
  });

  it('gera o hash no formato PHC', () => {
    assert.match(hashPassword('senha-secreta'), /^\$argon2id\$v=19\$m=\d+,t=\d+,p=\d+\$/);
  });
});

describe('verifyPassword', () => {
  it('aceita a senha correta', () => {
    assert.equal(verifyPassword('senha-secreta', hashPassword('senha-secreta')), true);
  });

  it('rejeita a senha errada', () => {
    assert.equal(verifyPassword('outra-senha', hashPassword('senha-secreta')), false);
  });

  it('rejeita um hash malformado', () => {
    assert.equal(verifyPassword('senha-secreta', 'nao-e-um-hash'), false);
  });
});
