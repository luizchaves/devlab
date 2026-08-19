import prisma from '../lib/prisma.js';
import { HttpError } from '../middlewares/error-handler.js';

// No Express 5 os erros de funcoes async chegam sozinhos ao middleware de erro.
export async function index(req, res) {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });

  res.json(users);
}

export async function show(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { posts: true },
  });

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export async function store(req, res) {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    throw new HttpError(400, 'Os campos "name" e "email" sao obrigatorios');
  }

  const user = await prisma.user.create({ data: { name, email } });

  res.status(201).json(user);
}

export async function update(req, res) {
  const { name, email } = req.body ?? {};

  const user = await prisma.user
    .update({
      where: { id: Number(req.params.id) },
      data: { ...(name && { name }), ...(email && { email }) },
    })
    .catch(() => undefined);

  if (!user) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.json(user);
}

export async function destroy(req, res) {
  const removed = await prisma.user
    .delete({ where: { id: Number(req.params.id) } })
    .catch(() => undefined);

  if (!removed) {
    throw new HttpError(404, 'Usuario nao encontrado');
  }

  res.status(204).end();
}
