import { createClient } from 'npm:@supabase/supabase-js@2';
import { ELIGIBLE_CATEGORIES, collectQuotes } from './logic.ts';
import { selectProvider } from './market-provider.ts';
import type { RunSummary } from './types.ts';

const json = (body: unknown, status = 200) => Response.json(body, { status });

// #region handler
Deno.serve(async (req) => {
  const authorization = req.headers.get('Authorization') ?? '';
  const url = Deno.env.get('SUPABASE_URL')!;

  // 1. Quem chamou? O JWT do usuario e verificado com a chave anonima. A chamada
  //    agendada (pg_cron) vem com a propria chave de servico e pula a sessao.
  const isService = authorization === `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`;

  if (!isService) {
    const anon = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authorization } },
    });
    const { data } = await anon.auth.getUser();
    if (!data.user) return json({ error: 'Sessao invalida' }, 401);
  }

  // 2. O que atualizar? A chave de servico ignora o RLS e ve os ativos de todas
  //    as contas. E a unica linha da aplicacao em que ela aparece.
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: assets, error } = await admin
    .from('assets')
    .select('id, ticker')
    .in('category', ELIGIBLE_CATEGORIES);
  if (error) return json({ error: error.message }, 500);

  // 3. Buscar no provedor, tolerando falha por ticker.
  const tickers = [...new Set(assets.map((a) => a.ticker))];
  const { quotes, failed } = await collectQuotes(selectProvider(), tickers);

  // 4. Gravar preco atual e historico, idempotente pela chave (asset_id, quote_date).
  for (const quote of quotes) {
    for (const asset of assets.filter((a) => a.ticker === quote.ticker)) {
      await admin.from('assets').update({ current_price: quote.price }).eq('id', asset.id);
      await admin
        .from('quotes_history')
        .upsert(
          { asset_id: asset.id, price: quote.price, quote_date: quote.quoteDate },
          { onConflict: 'asset_id,quote_date' }
        );
    }
  }

  // 5. O resumo operacional, gravado e devolvido.
  const summary: RunSummary = {
    ranAt: new Date().toISOString(),
    requested: tickers.length,
    updated: quotes.length,
    failed,
  };
  await admin
    .from('quote_runs')
    .insert({ requested: summary.requested, updated: summary.updated, failed });

  return json(summary);
});
// #endregion
