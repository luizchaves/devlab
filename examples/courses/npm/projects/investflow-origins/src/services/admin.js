import { supabase } from '../lib/supabase-client.js';

// #region metrics
/** Uma linha para admin, zero linhas para investidor. */
export async function adminMetrics() {
  const { data, error } = await supabase.rpc('admin_metrics');
  return { data: data?.[0] ?? null, error };
}
// #endregion

// #region checks
/**
 * Cada indicador e uma chamada barata e independente. Devolvem true/false;
 * quem monta a tela usa Promise.allSettled para que um nao derrube os outros.
 */
export const checks = {
  async auth() {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  },
  async database() {
    const { data, error } = await supabase.rpc('ping');
    return !error && data === 'pong';
  },
  async quotes() {
    const { data } = await supabase.rpc('admin_metrics');
    const last = data?.[0]?.last_quote_run;
    return Boolean(last) && Date.now() - new Date(last).getTime() < 24 * 60 * 60 * 1000;
  },
  async storage() {
    const { error } = await supabase.rpc('admin_receipts_stats');
    return !error;
  },
  async jobs() {
    const { data, error } = await supabase
      .from('quote_runs')
      .select('id')
      .order('ran_at', { ascending: false })
      .limit(1);
    return !error && data.length > 0;
  },
};
// #endregion
