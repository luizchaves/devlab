import { supabase } from '../lib/supabase-client.js';
import { findOrCreateBroker } from './brokers.js';

// Tudo que a carteira e a tela do ativo precisam, em uma chamada: o ativo, a
// corretora e as transacoes aninhadas (o "include" do PostgREST).
const ASSET_FIELDS =
  'id, ticker, name, category, currency, issuer, current_price, broker:brokers(id, name), transactions(id, type, quantity, price, transaction_date, receipt_path)';
export const QUOTED_CATEGORIES = ['acoes', 'fiis', 'etfs', 'fi_infra', 'cripto'];

// #region list
/**
 * Sem `.eq('user_id', …)`: o filtro por dono e do RLS. Escreve-lo aqui so
 * daria a falsa impressao de que a seguranca mora no cliente.
 */
export async function listAssets() {
  return supabase.from('assets').select(ASSET_FIELDS).order('ticker');
}

/**
 * Busca o ativo por ID (UUID) ou por Ticker (código do ativo).
 * Se for UUID válido, busca por `id`. Caso contrário, busca por `ticker` (case-insensitive).
 */
export async function getAsset(idOrTicker) {
  if (!idOrTicker) return { data: null, error: null };
  const str = String(idOrTicker).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  if (isUuid) {
    return supabase.from('assets').select(ASSET_FIELDS).eq('id', str).maybeSingle();
  }
  return supabase
    .from('assets')
    .select(ASSET_FIELDS)
    .ilike('ticker', str.toUpperCase())
    .maybeSingle();
}

/**
 * Busca o ativo especificamente pelo seu código / ticker.
 */
export async function getAssetByTicker(ticker) {
  if (!ticker) return { data: null, error: null };
  return supabase
    .from('assets')
    .select(ASSET_FIELDS)
    .ilike('ticker', String(ticker).trim().toUpperCase())
    .maybeSingle();
}
// #endregion

// #region ticker
// Renda fixa nao tem codigo de bolsa: sem ticker, o sistema inventa um
// (RF-NOME-XXXXX), unico por dono, para a unique (user_id, ticker) valer.
function normalizeTicker(ticker, category, name) {
  if (ticker?.trim()) return ticker.trim().toUpperCase();
  if (category === 'renda_fixa') {
    const cleanName =
      (name ?? 'RF')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 8) || 'RF';
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `RF-${cleanName}-${rand}`;
  }
  return (ticker ?? '').trim().toUpperCase();
}
// #endregion

// #region create
export async function createAsset({
  ticker,
  name,
  category,
  issuer,
  brokerName,
  currency = 'BRL',
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: broker, error: brokerError } = await findOrCreateBroker(brokerName ?? '', user.id);
  if (brokerError) return { data: null, error: brokerError };

  const resolvedTicker = normalizeTicker(ticker, category, name);

  // user_id vai no insert porque a policy WITH CHECK exige que seja o do token.
  return supabase
    .from('assets')
    .insert({
      user_id: user.id,
      ticker: resolvedTicker,
      name: name.trim(),
      category,
      currency: currency === 'USD' ? 'USD' : 'BRL',
      issuer: issuer?.trim() || null,
      broker_id: broker?.id ?? null,
    })
    .select(ASSET_FIELDS)
    .single();
}
// #endregion

// #region mutate
export async function updateAsset(
  id,
  { ticker, name, category, issuer, brokerName, currentPrice, currency }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: broker, error: brokerError } = await findOrCreateBroker(brokerName ?? '', user.id);
  if (brokerError) return { data: null, error: brokerError };

  const changes = {
    name: name.trim(),
    category,
    issuer: issuer?.trim() || null,
    broker_id: broker?.id ?? null,
  };
  if (currency) {
    changes.currency = currency === 'USD' ? 'USD' : 'BRL';
  }
  if (ticker?.trim()) {
    changes.ticker = ticker.trim().toUpperCase();
  }
  if (currentPrice !== undefined) {
    changes.current_price = currentPrice;
  } else if (!QUOTED_CATEGORIES.includes(category)) {
    changes.current_price = null;
  }

  return supabase.from('assets').update(changes).eq('id', id).select(ASSET_FIELDS).single();
}

export async function deleteAsset(id) {
  return supabase.from('assets').delete().eq('id', id);
}
// #endregion
