import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createHostSchema, readHostsSchema } from '@/schemas/host.schema.ts';

function parseBody(body: unknown) {
  return createHostSchema.safeParse({ body, query: {}, params: {} });
}

describe('createHostSchema', () => {
  it('accepts an IPv4 address', () => {
    assert.equal(parseBody({ name: 'Google DNS', address: '8.8.8.8' }).success, true);
  });

  it('accepts a domain name', () => {
    assert.equal(parseBody({ name: 'Portal', address: 'www.ifpb.edu.br' }).success, true);
  });

  it('rejects a full URL', () => {
    assert.equal(parseBody({ name: 'Portal', address: 'https://ifpb.edu.br' }).success, false);
  });

  it('rejects a name that is too short', () => {
    assert.equal(parseBody({ name: 'ab', address: '8.8.8.8' }).success, false);
  });

  it('treats the tag list as optional', () => {
    assert.equal(parseBody({ name: 'Google DNS', address: '8.8.8.8' }).success, true);
    assert.equal(
      parseBody({ name: 'Google DNS', address: '8.8.8.8', tags: ['infra'] }).success,
      true
    );
  });
});

describe('readHostsSchema', () => {
  it('rejects an empty filter', () => {
    const result = readHostsSchema.safeParse({ body: {}, params: {}, query: { tag: '' } });

    assert.equal(result.success, false);
  });
});
