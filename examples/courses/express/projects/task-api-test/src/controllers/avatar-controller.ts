import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as User from '#models/user-model.ts';

// #region store
/**
 * O `multer` ja gravou o arquivo quando este controller roda: aqui so resta
 * guardar o caminho e descartar o avatar anterior.
 */
export async function store(req: Request, res: Response) {
  if (!req.auth) throw new HttpError(401, 'Token de acesso ausente');
  if (!req.file) throw new HttpError(400, 'Envie um arquivo no campo "avatar"');

  const anterior = await User.findById(req.auth.sub);
  const user = await User.setAvatar(req.auth.sub, `uploads/${req.file.filename}`);

  // Sem isto, cada troca de avatar deixa um arquivo orfao no disco.
  if (anterior?.avatar) {
    await unlink(resolve(anterior.avatar)).catch(() => undefined);
  }

  res.status(201).json(user);
}
// #endregion
