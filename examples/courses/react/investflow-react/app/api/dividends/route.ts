import { getDividendsPage } from '@/server/dividends-page';
import { handle } from '@/server/http';
import { requireSession } from '@/server/session';

export const GET = handle(async () => {
  const session = await requireSession();
  return Response.json(await getDividendsPage(session.user.id));
});
