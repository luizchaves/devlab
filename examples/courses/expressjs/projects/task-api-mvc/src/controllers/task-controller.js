import { HttpError } from '../middlewares/error-handler.js';
import * as Task from '../models/task-model.js';

// #region read
export function index(req, res) {
  res.json(Task.findAll());
}

export function show(req, res) {
  const task = Task.findById(Number(req.params.id));

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}
// #endregion

// #region store
export function store(req, res) {
  const { title, done } = req.body ?? {};

  if (!title) {
    throw new HttpError(400, 'O campo "title" e obrigatorio');
  }

  const task = Task.create({ title, done });

  res.status(201).json(task);
}
// #endregion

// #region write
export function update(req, res) {
  const task = Task.update(Number(req.params.id), req.body ?? {});

  if (!task) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.json(task);
}

export function destroy(req, res) {
  const removed = Task.remove(Number(req.params.id));

  if (!removed) {
    throw new HttpError(404, 'Tarefa nao encontrada');
  }

  res.status(204).end();
}
// #endregion
