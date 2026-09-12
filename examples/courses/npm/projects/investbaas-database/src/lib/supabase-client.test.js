import { describe, expect, it, vi } from 'vitest';

// TK02-1: o cliente existe uma vez e recusa subir sem as duas variaveis publicas.
describe('supabase-client', () => {
  it('expoe um cliente criado com a URL e a chave anonima', async () => {
    const { supabase } = await import('./supabase-client.js');

    expect(supabase.auth).toBeDefined();
    expect(supabase.supabaseUrl).toBe('http://127.0.0.1:54321');
  });

  it('lanca um erro claro quando falta variavel de ambiente', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    await expect(import('./supabase-client.js')).rejects.toThrow('VITE_SUPABASE_ANON_KEY');

    vi.unstubAllEnvs();
  });
});
