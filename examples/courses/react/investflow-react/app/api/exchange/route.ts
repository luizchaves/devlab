import { handle } from '@/server/http';
import { listExchangeRates } from '@/server/exchange';
import { requireSession } from '@/server/session';

/** Taxas USD/BRL lidas por qualquer sessão; a escrita fica com a rodada de cotações. */
export const GET = handle(async () => {
  await requireSession();
  return Response.json({ rates: await listExchangeRates() });
});
