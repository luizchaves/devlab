import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { validated } from '#middlewares/validate.ts';
import * as Task from '#models/task-model.ts';
import { publish } from '#services/events-service.ts';
import {
  createTaskSchema,
  listTasksSchema,
  removeTaskSchema,
  showTaskSchema,
  updateTaskSchema,
} from '#schemas/task.ts';

// #region owner
/**
 * O dono vem do token, nunca do corpo nem da query.
 *
 * Aceitar `userId` do cliente seria o mesmo que nao ter autorizacao: bastaria
 * mandar o id de outra pessoa.
 */
function ownerId(req: Request): string {
  if (!req.auth) {
    throw new HttpError(401, 'Token de acesso ausente');
  }

  return req.auth.sub;
}
// #endregion

// #region read
export async function index(req: Request, res: Response) {
  const { query } = validated(req, listTasksSchema);

  res.json(await Task.findAll(ownerId(req), query));
}

export async function show(req: Request, res: Response) {
  const { params } = validated(req, showTaskSchema);
  const task = await Task.findById(ownerId(req), params.id);

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}
// #endregion

// #region store
export async function store(req: Request, res: Response) {
  const { body } = validated(req, createTaskSchema);
  const userId = ownerId(req);

  if (await Task.findByTitle(userId, body.title)) {
    throw new HttpError(409, 'Ja existe uma tarefa com esse titulo');
  }

  const task = await Task.create(userId, body);

  // Quem estiver ouvindo o fluxo do dono recebe a tarefa nova na hora.
  publish(userId, 'task.created', task);

  res.status(201).json(task);
}
// #endregion

// #region write
export async function update(req: Request, res: Response) {
  const { params, body } = validated(req, updateTaskSchema);
  const task = await Task.update(ownerId(req), params.id, body);

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  publish(ownerId(req), 'task.updated', task);

  res.json(task);
}

export async function destroy(req: Request, res: Response) {
  const { params } = validated(req, removeTaskSchema);

  if (!(await Task.remove(ownerId(req), params.id))) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.status(204).end();
}
// #endregion
