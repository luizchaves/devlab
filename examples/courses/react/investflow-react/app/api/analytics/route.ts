import { getAnalytics } from '@/server/analytics';
import { handle } from '@/server/http';
import { requireSession } from '@/server/session';

/** Série mensal, distribuição por classe e totais do dono da sessão. */
export const GET = handle(async () => {
  const session = await requireSession();
  return Response.json(await getAnalytics(session.user.id));
});
