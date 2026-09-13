import { getAssetEvolution } from '@/server/analytics';
import { handle } from '@/server/http';
import { requireSession } from '@/server/session';

type Context = { params: Promise<{ id: string }> };

export const GET = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  const result = await getAssetEvolution(session.user.id, (await params).id);
  if (!result) return Response.json({ error: 'Ativo não encontrado.' }, { status: 404 });
  return Response.json(result);
});
