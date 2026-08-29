import type { Request, Response } from 'express';

import * as User from '#models/user-model.ts';

/** Rota administrativa: so `role: 'admin'` chega ate aqui. */
export function index(_req: Request, res: Response) {
  res.json(User.findAll());
}
