import type { Request, Response } from 'express';

import { validated } from '#middlewares/validate.ts';
import { pingSchema } from '#schemas/ping.ts';
import { ping } from '#services/ping-service.ts';

// #region show
export async function show(req: Request, res: Response) {
  const { query } = validated(req, pingSchema);

  res.json({ host: query.host, ...(await ping(query.host)) });
}
// #endregion
