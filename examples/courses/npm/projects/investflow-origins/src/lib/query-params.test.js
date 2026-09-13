import { beforeEach, describe, expect, it } from 'vitest';
import { getQueryParam, getQueryParams, setQueryParams } from './query-params.js';

describe('query-params', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/test.html');
  });

  it('retorna o valor padrao quando o parametro nao existe', () => {
    expect(getQueryParam('filter', 'active')).toBe('active');
    expect(getQueryParams({ filter: 'active', sort: 'name' })).toEqual({
      filter: 'active',
      sort: 'name',
    });
  });

  it('le valores presentes na querystring', () => {
    window.history.replaceState({}, '', '/test.html?filter=all&sort=value&dir=desc');
    expect(getQueryParam('filter', 'active')).toBe('all');
    expect(getQueryParam('sort', 'name')).toBe('value');
    expect(getQueryParam('dir', 'asc')).toBe('desc');

    expect(
      getQueryParams({
        filter: 'active',
        sort: 'name',
        dir: 'asc',
      })
    ).toEqual({
      filter: 'all',
      sort: 'value',
      dir: 'desc',
    });
  });

  it('atualiza a URL sem recarregar e omite valores padrao ou nulos', () => {
    setQueryParams(
      { filter: 'all', sort: 'name', dir: 'desc' },
      { filter: 'active', sort: 'name', dir: 'asc' }
    );
    expect(window.location.search).toBe('?filter=all&dir=desc');

    // Quando volta para o padrao, remove da URL
    setQueryParams(
      { filter: 'active', sort: 'name', dir: 'asc' },
      { filter: 'active', sort: 'name', dir: 'asc' }
    );
    expect(window.location.search).toBe('');
  });
});
