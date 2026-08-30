import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import * as Task from '#models/task-model.ts';
import type { TaskInput } from '#types/task.ts';

// #region id-request
/** `Request` com o `:id` da rota ja tipado como string. */
type IdRequest = Request<{ id: string }>;

function parseId(req: IdRequest): number {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new HttpError(400, 'O id precisa ser um numero inteiro');
  }

  return id;
}
// #endregion

// #region read
export function index(_req: Request, res: Response) {
  res.json(Task.findAll());
}

export function show(req: IdRequest, res: Response) {
  const task = Task.findById(parseId(req));

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}
// #endregion

// #region store
export function store(req: Request, res: Response) {
  const { title, done } = (req.body ?? {}) as TaskInput;

  if (!title) {
    throw new HttpError(400, 'O campo "title" e obrigatorio');
  }

  if (Task.findByTitle(title)) {
    throw new HttpError(409, 'Ja existe uma tarefa com esse titulo');
  }

  res.status(201).json(Task.create({ title, done }));
}
// #endregion

// #region write
export function update(req: IdRequest, res: Response) {
  const task = Task.update(parseId(req), (req.body ?? {}) as TaskInput);

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}

export function destroy(req: IdRequest, res: Response) {
  if (!Task.remove(parseId(req))) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.status(204).end();
}
// #endregion
