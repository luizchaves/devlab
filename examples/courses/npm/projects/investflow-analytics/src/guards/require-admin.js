import { supabase } from '../lib/supabase-client.js';
import { requireSession } from './require-session.js';

// #region guard
/**
 * Estende a guarda de sessao lendo profiles.role. A policy de profiles so
 * deixa cada pessoa ler a propria linha, entao a consulta e segura por
 * construcao. E cortesia de front: quem barra o investidor de verdade e o
 * is_admin() dentro de admin_metrics().
 */
export async function requireAdmin({ location = window.location } = {}) {
  const session = await requireSession({ location });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    location.replace('./dashboard.html');
    return new Promise(() => {});
  }

  return session;
}
// #endregion
