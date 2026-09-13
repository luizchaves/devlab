import { adminMetrics, serviceChecks } from '@/server/admin';
import { handle } from '@/server/http';
import { requireAdmin } from '@/server/session';

// #region route
/** Investidor comum recebe 403 (CA06.4); administrador, só agregados (CA06.5). */
export const GET = handle(async () => {
  await requireAdmin();
  const [metrics, checks] = await Promise.all([adminMetrics(), serviceChecks()]);
  return Response.json({ metrics, checks });
});
// #endregion
