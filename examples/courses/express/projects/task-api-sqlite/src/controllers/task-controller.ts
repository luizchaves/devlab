import type { Request, Response } from 'express';

import { HttpError } from '#errors/HttpError.ts';
import { validated } from '#middlewares/validate.ts';
import * as Task from '#models/task-model.ts';
import {
  createTaskSchema,
  listTasksSchema,
  removeTaskSchema,
  showTaskSchema,
  updateTaskSchema,
} from '#schemas/task.ts';

// #region read
export async function index(req: Request, res: Response) {
  const { query } = validated(req, listTasksSchema);

  res.json(await Task.findAll(query));
}

export async function show(req: Request, res: Response) {
  const { params } = validated(req, showTaskSchema);
  const task = await Task.findById(params.id);

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}
// #endregion

// #region store
export async function store(req: Request, res: Response) {
  const { body } = validated(req, createTaskSchema);

  if (await Task.findByTitle(body.title)) {
    throw new HttpError(409, 'Ja existe uma tarefa com esse titulo');
  }

  res.status(201).json(await Task.create(body));
}
// #endregion

// #region write
export async function update(req: Request, res: Response) {
  const { params, body } = validated(req, updateTaskSchema);
  const task = await Task.update(params.id, body);

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}

export async function destroy(req: Request, res: Response) {
  const { params } = validated(req, removeTaskSchema);

  if (!(await Task.remove(params.id))) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.status(204).end();
}
// #endregion
