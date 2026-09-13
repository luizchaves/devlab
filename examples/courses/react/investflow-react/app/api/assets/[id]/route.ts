import { assetSchema } from '@/core/assets';
import { deleteAsset, getAsset, updateAsset } from '@/server/assets';
import { handle, validationResponse } from '@/server/http';
import { requireSession } from '@/server/session';

type Context = { params: Promise<{ id: string }> };

// #region routes
/** `id` aceita o id ou o ticker; ativo alheio responde 404, sem confirmar que existe (CA03.10). */
export const GET = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  const asset = await getAsset(session.user.id, (await params).id);
  if (!asset) return Response.json({ error: 'Ativo não encontrado.' }, { status: 404 });
  return Response.json({ asset });
});

export const PATCH = handle(async (request: Request, { params }: Context) => {
  const session = await requireSession();
  const parsed = assetSchema.safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);

  const asset = await updateAsset(session.user.id, (await params).id, parsed.data);
  return Response.json({ asset });
});

export const DELETE = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  await deleteAsset(session.user.id, (await params).id);
  return new Response(null, { status: 204 });
});
// #endregion
