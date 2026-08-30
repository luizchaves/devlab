import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import API from './api.js';

describe('API', () => {
  beforeEach(() => {
    localStorage.setItem('@monitor-app:token', 'token-de-teste');

    // O `fetch` e trocado por um dublê: o teste verifica a requisição montada,
    // não a rede.
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    }));
  });

  afterEach(() => {
    localStorage.clear();

    vi.restoreAllMocks();
  });

  it('prefixes the resource with /api', async () => {
    await API.read('/hosts');

    expect(fetch).toHaveBeenCalledWith('/api/hosts', expect.anything());
  });

  it('sends the token in the Authorization header', async () => {
    await API.read('/hosts');

    const [, config] = fetch.mock.calls[0];

    expect(config.headers.Authorization).toBe('Bearer token-de-teste');
  });

  it('serializes the body and declares the Content-Type', async () => {
    await API.create('/hosts', { name: 'Google DNS', address: '8.8.8.8' });

    const [, config] = fetch.mock.calls[0];

    expect(config.method).toBe('POST');
    expect(JSON.parse(config.body).address).toBe('8.8.8.8');
    expect(config.headers['Content-Type']).toContain('application/json');
  });

  it('omits the Content-Type when there is no body', async () => {
    await API.create('/hosts/1/pings');

    const [, config] = fetch.mock.calls[0];

    expect(config.headers['Content-Type']).toBeUndefined();
  });

  it('does not send a token on signin', async () => {
    await API.create('/signin', { email: 'a@b.c', password: '12345678' }, { auth: false });

    const [, config] = fetch.mock.calls[0];

    expect(config.headers.Authorization).toBeUndefined();
  });
});
