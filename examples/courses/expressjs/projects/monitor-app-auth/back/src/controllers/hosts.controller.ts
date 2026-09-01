import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Host from '@/models/Host.ts';
import type { HostInput } from '@/types/Host.d.ts';

async function create(req: Request, res: Response) {
  try {
    const host = req.body as HostInput;

    // O dono vem do token, e nao do corpo: nao ha como cadastrar host no nome
    // de outra conta, mesmo enviando `userId` no JSON.
    const createdHost = await Host.create({ ...host, userId: req.userId });

    return res.status(201).json(createdHost);
  } catch {
    throw new HttpError('Unable to create host', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name, tag } = req.query as { name?: string; tag?: string };

    const hosts = await Host.read({ userId: String(req.userId), name, tag });

    return res.json(hosts);
  } catch {
    throw new HttpError('Unable to read hosts', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const host = await Host.readById(id, String(req.userId));

    return res.json(host);
  } catch {
    // Host de outra conta responde 404, e nao 403: a existencia do recurso
    // tambem e informacao.
    throw new HttpError('Host not found', 404);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  await Host.readById(id, String(req.userId)).catch(() => {
    throw new HttpError('Host not found', 404);
  });

  try {
    const host = req.body as HostInput;

    const updatedHost = await Host.update({ ...host, id, userId: req.userId });

    return res.json(updatedHost);
  } catch {
    throw new HttpError('Unable to update host', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    await Host.remove(id, String(req.userId));

    return res.sendStatus(204);
  } catch {
    throw new HttpError('Host not found', 404);
  }
}

export default { create, read, readById, update, remove };
