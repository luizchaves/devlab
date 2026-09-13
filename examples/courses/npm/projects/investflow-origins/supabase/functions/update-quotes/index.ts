import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  ELIGIBLE_CATEGORIES,
  USD_BRL_SYMBOL,
  collectQuotes,
  needsUsdConversion,
  priceInAssetCurrency,
  quoteSymbol,
  shouldFetchFromProvider,
} from './logic.ts';
import { selectProvider } from './market-provider.ts';
import type { RunSummary } from './types.ts';

const json = (body: unknown, status = 200) => Response.json(body, { status });

// #region handler
Deno.serve(async (req) => {
  const authorization = req.headers.get('Authorization') ?? '';
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anonKey || !serviceRoleKey) {
    return json({ error: 'Ambiente Supabase incompleto' }, 500);
  }

  // 1. Quem chamou? O JWT do usuario e verificado com a chave anonima. A chamada
  //    agendada (pg_cron) vem com a propria chave de servico e pula a sessao.
  const isService = authorization === `Bearer ${serviceRoleKey}`;
  let userId: string | null = null;

  if (!isService) {
    const anon = createClient(url, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const { data } = await anon.auth.getUser();
    if (!data.user) return json({ error: 'Sessao invalida' }, 401);
    userId = data.user.id;
  }

  // 2. O que atualizar? Usuario comum atualiza so a propria carteira. A chave de
  //    servico, usada pelo agendamento, continua global. Um `asset_id` no corpo
  //    restringe a um unico ativo (botao "Atualizar" da pagina do ativo).
  let assetId: string | null = null;
  try {
    const body = await req.json();
    if (typeof body?.asset_id === 'string') assetId = body.asset_id;
  } catch {
    // corpo vazio ou nao-JSON: atualiza a carteira inteira
  }

  const admin = createClient(url, serviceRoleKey);
  let query = admin
    .from('assets')
    .select('id, ticker, category, currency')
    .in('category', ELIGIBLE_CATEGORIES);
  if (userId) query = query.eq('user_id', userId);
  if (assetId) query = query.eq('id', assetId);

  const { data: assets, error } = await query;
  if (error) return json({ error: error.message }, 500);

  // 3. Verificar cotacoes existentes no banco para evitar consultas externas
  //    desnecessarias quando o valor de fechamento ja for o vigente (fora do horario de pregao).
  const assetIds = assets.map((a) => a.id);
  const { data: existingQuotes } = await admin
    .from('quotes_history')
    .select('asset_id, price, quote_date, created_at')
    .in('asset_id', assetIds)
    .order('quote_date', { ascending: false });

  const latestQuoteByAsset = new Map<
    string,
    { price: number; quoteDate: string; updatedAt: string }
  >();
  if (existingQuotes) {
    for (const q of existingQuotes) {
      if (!latestQuoteByAsset.has(q.asset_id)) {
        latestQuoteByAsset.set(q.asset_id, {
          price: q.price,
          quoteDate: q.quote_date,
          updatedAt: q.created_at,
        });
      }
    }
  }

  const now = new Date();
  const assetsToFetch = assets.filter((asset) => {
    const lastQuote = latestQuoteByAsset.get(asset.id);
    return shouldFetchFromProvider(asset, lastQuote, now);
  });

  // 4. Buscar no provedor apenas os simbolos necessarios. Cripto em real e
  //    qualquer ativo em dolar pedem tambem o cambio USD/BRL, que nao entra no
  //    resumo: e a taxa que a carteira usa para somar tudo em reais.
  const tickers = [...new Set(assets.map(quoteSymbol))];
  const tickersToFetch = [...new Set(assetsToFetch.map(quoteSymbol))];
  const wantsFx = assets.some((a) => a.currency === 'USD' || needsUsdConversion(a));
  const { quotes: allQuotes, failed: allFailed } = await collectQuotes(
    selectProvider(),
    wantsFx ? [...tickersToFetch, USD_BRL_SYMBOL] : tickersToFetch
  );
  const fx = allQuotes.find((q) => q.ticker === USD_BRL_SYMBOL);
  const usdBrlRate = fx?.price;
  const quotes = allQuotes.filter((q) => q.ticker !== USD_BRL_SYMBOL);
  const failed = allFailed.filter((f) => f.ticker !== USD_BRL_SYMBOL);

  // #region fx
  // A taxa do dia fica em exchange_rates, escrita so daqui (chave de servico):
  // o navegador le, nunca grava. Idempotente por (par, data).
  if (fx) {
    await admin
      .from('exchange_rates')
      .upsert(
        { from_currency: 'USD', to_currency: 'BRL', rate: fx.price, rate_date: fx.quoteDate },
        { onConflict: 'from_currency,to_currency,rate_date' }
      );
  }
  // #endregion

  // 5. Gravar preco atual e historico, idempotente pela chave (asset_id, quote_date).
  const updatedSymbols = new Set<string>();
  for (const quote of quotes) {
    for (const asset of assets.filter((a) => quoteSymbol(a) === quote.ticker)) {
      const price = priceInAssetCurrency(asset, quote.price, usdBrlRate);
      if (price == null) {
        failed.push({ ticker: quote.ticker, reason: 'provider_error' });
        continue;
      }
      updatedSymbols.add(quote.ticker);
      await admin.from('assets').update({ current_price: price }).eq('id', asset.id);
      await admin
        .from('quotes_history')
        .upsert(
          { asset_id: asset.id, price, quote_date: quote.quoteDate },
          { onConflict: 'asset_id,quote_date' }
        );
    }
  }

  // 6. O resumo operacional, gravado e devolvido.
  const summary: RunSummary = {
    ranAt: new Date().toISOString(),
    requested: tickers.length,
    updated: updatedSymbols.size,
    failed,
  };
  await admin
    .from('quote_runs')
    .insert({ requested: summary.requested, updated: summary.updated, failed });

  return json(summary);
});
// #endregion
