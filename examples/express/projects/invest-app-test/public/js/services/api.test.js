import { afterEach, describe, expect, it, vi } from 'vitest';

import Auth from '../lib/auth.js';
import API from './api.js';

describe('API service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('sends JSON payloads with the authenticated user token', async () => {
    localStorage.setItem('@invest-app:token', 'valid-token');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 200,
      json: async () => ({ id: 'investment-1' }),
    });

    const response = await API.create('/investments', { name: 'Tesouro Selic' });

    expect(response).toEqual({ id: 'investment-1' });
    expect(fetchMock).toHaveBeenCalledWith('/api/investments', {
      method: 'POST',
      body: JSON.stringify({ name: 'Tesouro Selic' }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer valid-token',
      },
    });
  });

  it('does not set Content-Type manually when sending FormData', async () => {
    localStorage.setItem('@invest-app:token', 'valid-token');
    const formData = new FormData();
    formData.append('image', new Blob(['avatar']), 'avatar.png');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({ path: '/imgs/profile/avatar.png' }),
    });

    await API.create('/users/image', formData, true, true);

    expect(fetchMock).toHaveBeenCalledWith('/api/users/image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer valid-token',
      },
    });
  });

  it('signs out when an authenticated request receives 401', async () => {
    localStorage.setItem('@invest-app:token', 'expired-token');
    vi.spyOn(Auth, 'signout').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 401,
      json: async () => ({ message: 'Token invalid.' }),
    });

    await API.read('/users/me');

    expect(Auth.signout).toHaveBeenCalled();
  });
});
