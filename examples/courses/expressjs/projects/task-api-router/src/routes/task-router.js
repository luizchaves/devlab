// #region create-router
import { Router } from 'express';

const router = Router();
// #endregion

const tasks = [
  { id: 1, title: 'Estudar rotas do Express', done: true },
  { id: 2, title: 'Escrever a primeira API', done: false },
];

let nextId = 3;

// #region routes
// "/" aqui e /tasks na aplicacao; "/:id" e /tasks/:id.
router.get('/', (req, res) => {
  res.json(tasks);
});

router.get('/:id', (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: 'Tarefa nao encontrada' });
  }

  res.json(task);
});

router.post('/', (req, res) => {
  const { title } = req.body ?? {};

  if (!title) {
    return res.status(400).json({ message: 'O campo "title" e obrigatorio' });
  }

  const task = { id: nextId, title, done: false };

  nextId += 1;
  tasks.push(task);

  res.status(201).json(task);
});
// #endregion

export default router;
