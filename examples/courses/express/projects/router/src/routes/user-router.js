import { Router } from 'express';

const router = Router();

const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bruno' },
];

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'Usuario nao encontrado' });
  }

  res.json(user);
});

export default router;
