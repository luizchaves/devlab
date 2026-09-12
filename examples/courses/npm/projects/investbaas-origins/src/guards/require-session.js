import { getSession } from '../services/auth.js';

// #region guard
/**
 * Guarda das paginas privadas. E uma cortesia de interface: quem impede uma
 * consulta de outra conta e o RLS, nao este `if`.
 *
 * Sem sessao, redireciona e devolve uma promessa que nunca resolve, para que o
 * resto do modulo da pagina nao execute.
 */
export async function requireSession({
  redirectTo = './signin.html',
  location = window.location,
} = {}) {
  const { data } = await getSession();

  if (!data.session) {
    location.replace(redirectTo);
    return new Promise(() => {});
  }

  return data.session;
}
// #endregion
