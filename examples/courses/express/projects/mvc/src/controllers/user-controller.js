import { HttpError } from '../middlewares/error-handler.js';
import * as User from '../models/user-model.js';

export function index(req, res) {
  res.json(User.findAll());
}

export function show(req, res) {
  const user = User.findById(Number(req.params.id));

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export function store(req, res) {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    throw new HttpError(400, 'Os campos "name" e "email" sao obrigatorios');
  }

  const user = User.create({ name, email });

  res.status(201).json(user);
}

export function update(req, res) {
  const user = User.update(Number(req.params.id), req.body ?? {});

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export function destroy(req, res) {
  const removed = User.remove(Number(req.params.id));

  if (!removed) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.status(204).end();
}
