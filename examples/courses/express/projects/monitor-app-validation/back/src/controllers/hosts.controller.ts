import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import Host from '@/models/Host.ts';
import type { HostInput } from '@/types/Host.d.ts';

async function create(req: Request, res: Response) {
  try {
    const host = req.body as HostInput;

    const createdHost = await Host.create(host);

    return res.status(201).json(createdHost);
  } catch {
    throw new HttpError('Unable to create host', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    const hosts = name ? await Host.read('name', name) : await Host.read();

    return res.json(hosts);
  } catch {
    throw new HttpError('Unable to read hosts', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const host = await Host.readById(id);

    return res.json(host);
  } catch {
    throw new HttpError('Host not found', 404);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const host = req.body as HostInput;
    const { id } = req.params;

    const updatedHost = await Host.update({ ...host, id });

    return res.json(updatedHost);
  } catch {
    throw new HttpError('Unable to update host', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    await Host.remove(id);

    return res.sendStatus(204);
  } catch {
    throw new HttpError('Host not found', 404);
  }
}

export default { create, read, readById, update, remove };
