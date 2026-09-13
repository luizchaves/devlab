// #region client
import { createClient } from '@supabase/supabase-js';

// O prefixo VITE_ e o que autoriza o Vite a embutir a variavel no bundle: e a
// marca de "publico". Uma variavel sem o prefixo nunca chega ao navegador.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
}

// A chave anonima identifica o projeto; quem limita o acesso e o RLS (Sprint 3).
export const supabase = createClient(url, anonKey);
// #endregion
