import { handle } from '@/server/http';
import { updateQuotes } from '@/server/quotes/update';
import { requireSession } from '@/server/session';

// #region route
/** `POST /api/quotes/update` com `{ assetId? }`: a carteira inteira ou um ativo só. */
export const POST = handle(async (request: Request) => {
  const session = await requireSession();
  const body = (await request.json().catch(() => ({}))) as { assetId?: unknown };
  const assetId = typeof body.assetId === 'string' ? body.assetId : undefined;

  const summary = await updateQuotes(session.user.id, { assetId });
  return Response.json(summary);
});
// #endregion
