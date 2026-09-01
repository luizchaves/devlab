import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Host from '@/models/Host.ts';
import Ping from '@/models/Ping.ts';

async function readByHost(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  // A checagem de dono acontece antes de ler o historico: sem ela, o id de um
  // host alheio devolveria as medicoes dele.
  await Host.readById(id, String(req.userId)).catch(() => {
    throw new HttpError('Host not found', 404);
  });

  return res.json(await Ping.readByHost(id));
}

/** Executa o `ping` agora, sem esperar a proxima rodada do agendador. */
async function check(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  await Host.readById(id, String(req.userId)).catch(() => {
    throw new HttpError('Host not found', 404);
  });

  const ping = await Ping.check(id);

  return res.status(201).json(ping);
}

export default { readByHost, check };
