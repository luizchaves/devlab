import { syncDividends } from '@/server/dividends';
import { handle } from '@/server/http';
import { requireSession } from '@/server/session';

type Context = { params: Promise<{ id: string }> };

/** Busca o histórico de proventos no provedor e grava sem duplicar. */
export const POST = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  return Response.json(await syncDividends(session.user.id, (await params).id));
});
