import { assetSchema } from '@/core/assets';
import { createAsset, listAssets } from '@/server/assets';
import { handle, validationResponse } from '@/server/http';
import { requireSession } from '@/server/session';

// #region routes
/** Carteira do dono da sessão (CA03.4): a lista já vem com os lançamentos. */
export const GET = handle(async () => {
  const session = await requireSession();
  return Response.json({ assets: await listAssets(session.user.id) });
});

export const POST = handle(async (request: Request) => {
  const session = await requireSession();
  const parsed = assetSchema.safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);

  const asset = await createAsset(session.user.id, parsed.data);
  return Response.json({ asset }, { status: 201 });
});
// #endregion
