import { supabase } from '../lib/supabase-client.js';

/** A mesma frase para e-mail inexistente e senha errada: nao entregar a lista de contas. */
export const INVALID_CREDENTIALS = 'E-mail ou senha invalidos';

// #region sign-up
/**
 * Cria a conta no Supabase Auth. O nome vai em `options.data`, que o Auth grava
 * em `raw_user_meta_data`; e de la que a trigger de `profiles` o copia.
 */
export async function signUp({ fullName, email, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}
// #endregion

// #region sign-in
/**
 * Devolve `{ data, error }` como o SDK, mas com o erro de credencial traduzido
 * para uma unica mensagem, seja qual for a causa.
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { data, error: { ...error, message: INVALID_CREDENTIALS } };
  }

  return { data, error: null };
}
// #endregion

// #region session
export function getSession() {
  return supabase.auth.getSession();
}

/** Apaga a sessao do localStorage e revoga o refresh token no servidor. */
export function signOut() {
  return supabase.auth.signOut();
}

/** Reage ao fim da sessao vindo de outra aba ou de uma revogacao no servidor. */
export function onSessionEnd(callback) {
  return supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') callback();
  });
}
// #endregion
