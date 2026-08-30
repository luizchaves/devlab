import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as User from '#models/user-model.ts';
import type { UserInput } from '#types/user.ts';

/** `Request` com o `:id` da rota ja tipado como string. */
type IdRequest = Request<{ id: string }>;

function parseId(req: IdRequest): number {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new HttpError(400, 'O id precisa ser um numero inteiro');
  }

  return id;
}

export function index(_req: Request, res: Response) {
  res.json(User.findAll());
}

export function show(req: IdRequest, res: Response) {
  const user = User.findById(parseId(req));

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export function store(req: Request, res: Response) {
  const { name, email } = (req.body ?? {}) as UserInput;

  if (!name || !email) {
    throw new HttpError(400, 'Os campos "name" e "email" sao obrigatorios');
  }

  if (User.findByEmail(email)) {
    throw new HttpError(409, 'E-mail ja cadastrado');
  }

  res.status(201).json(User.create({ name, email }));
}

export function update(req: IdRequest, res: Response) {
  const user = User.update(parseId(req), (req.body ?? {}) as UserInput);

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export function destroy(req: IdRequest, res: Response) {
  if (!User.remove(parseId(req))) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.status(204).end();
}
