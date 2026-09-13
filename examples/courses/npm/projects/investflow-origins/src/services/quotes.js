import { supabase } from '../lib/supabase-client.js';

// #region invoke
/**
 * `functions.invoke` ja envia o JWT da sessao no Authorization. Sem `assetId`
 * atualiza a carteira inteira; com ele, so aquele ativo.
 */
export async function updateQuotes({ assetId } = {}) {
  return supabase.functions.invoke('update-quotes', {
    method: 'POST',
    ...(assetId ? { body: { asset_id: assetId } } : {}),
  });
}

/** "12 atualizados, 1 sem cotacao (XPTO3)": o resumo vira uma frase. */
export function describeRun(summary) {
  const failed = summary.failed.length
    ? `, ${summary.failed.length} sem cotacao (${summary.failed.map((f) => f.ticker).join(', ')})`
    : '';
  return `${summary.updated} atualizado(s)${failed}`;
}

/** Registra uma cotacao historica pontual (ex: renda fixa mes a mes ou ajuste manual). */
export async function recordQuote(
  assetId,
  price,
  quoteDate = new Date().toISOString().slice(0, 10)
) {
  return supabase
    .from('quotes_history')
    .upsert(
      { asset_id: assetId, price, quote_date: quoteDate },
      { onConflict: 'asset_id,quote_date' }
    );
}
// #endregion
