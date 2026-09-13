import { getOrigins } from '@/server/analytics';
import { handle } from '@/server/http';
import { requireSession } from '@/server/session';

/** Linhas de origem (corretora, categoria, emissor, valor) só do dono (CA07.3). */
export const GET = handle(async () => {
  const session = await requireSession();
  return Response.json({ rows: await getOrigins(session.user.id) });
});
