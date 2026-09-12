import { supabase } from '../lib/supabase-client.js';

// #region invoke
/** `functions.invoke` ja envia o JWT da sessao no Authorization. */
export async function updateQuotes() {
  return supabase.functions.invoke('update-quotes', { method: 'POST' });
}

/** "12 atualizados, 1 sem cotacao (XPTO3)": o resumo vira uma frase. */
export function describeRun(summary) {
  const failed = summary.failed.length
    ? `, ${summary.failed.length} sem cotacao (${summary.failed.map((f) => f.ticker).join(', ')})`
    : '';
  return `${summary.updated} atualizado(s)${failed}`;
}
// #endregion
