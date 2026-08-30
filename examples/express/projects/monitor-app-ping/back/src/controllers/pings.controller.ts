import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Host from '@/models/Host.ts';
import Ping from '@/models/Ping.ts';

async function readByHost(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  // Um host inexistente responde 404; um host sem historico responde `[]`.
  await Host.readById(id).catch(() => {
    throw new HttpError('Host not found', 404);
  });

  return res.json(await Ping.readByHost(id));
}

/** Executa o `ping` agora, sem esperar a proxima rodada do agendador. */
async function check(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  try {
    const ping = await Ping.check(id);

    return res.status(201).json(ping);
  } catch {
    throw new HttpError('Host not found', 404);
  }
}

export default { readByHost, check };
