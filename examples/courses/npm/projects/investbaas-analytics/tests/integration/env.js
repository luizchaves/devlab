import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// #region env
// Le o .env sem dotenv, no mesmo espirito das outras trilhas. Os testes de
// integracao rodam em node, fora do Vite, entao import.meta.env nao existe.
function loadEnv() {
  try {
    for (const line of readFileSync(new URL('../../.env', import.meta.url), 'utf8').split('\n')) {
      const [key, ...rest] = line.split('=');
      if (key && !key.startsWith('#') && rest.length)
        process.env[key.trim()] ??= rest.join('=').trim();
    }
  } catch {
    // Sem .env: os testes de integracao sao pulados com uma mensagem clara.
  }
}

loadEnv();

export const url = process.env.VITE_SUPABASE_URL;
export const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
export const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const hasStack = Boolean(url && anonKey && serviceKey);

/** Um cliente por usuario: cada um guarda a propria sessao. */
export const anonClient = () =>
  createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

/** So os testes usam a chave de servico, para ler entre contas e provar o isolamento. */
export const adminClient = () =>
  createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

export const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
// #endregion
