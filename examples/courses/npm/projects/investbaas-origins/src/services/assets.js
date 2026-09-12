import { supabase } from '../lib/supabase-client.js';
import { findOrCreateBroker } from './brokers.js';

// Tudo que a carteira e a tela do ativo precisam, em uma chamada: o ativo, a
// corretora e as transacoes aninhadas (o "include" do PostgREST).
const ASSET_FIELDS =
  'id, ticker, name, category, issuer, current_price, broker:brokers(id, name), transactions(id, type, quantity, price, transaction_date, receipt_path)';

// #region list
/**
 * Sem `.eq('user_id', …)`: o filtro por dono e do RLS. Escreve-lo aqui so
 * daria a falsa impressao de que a seguranca mora no cliente.
 */
export async function listAssets() {
  return supabase.from('assets').select(ASSET_FIELDS).order('ticker');
}

export async function getAsset(id) {
  // maybeSingle: zero linhas vira null, nao erro. E assim que "nao e seu" e
  // "nao existe" ficam indistinguiveis para o cliente.
  return supabase.from('assets').select(ASSET_FIELDS).eq('id', id).maybeSingle();
}
// #endregion

// #region create
export async function createAsset({ ticker, name, category, issuer, brokerName }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: broker, error: brokerError } = await findOrCreateBroker(brokerName ?? '', user.id);
  if (brokerError) return { data: null, error: brokerError };

  // user_id vai no insert porque a policy WITH CHECK exige que seja o do token.
  return supabase
    .from('assets')
    .insert({
      user_id: user.id,
      ticker: ticker.trim().toUpperCase(),
      name: name.trim(),
      category,
      issuer: issuer?.trim() || null,
      broker_id: broker?.id ?? null,
    })
    .select(ASSET_FIELDS)
    .single();
}
// #endregion
