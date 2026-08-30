// #region setup
import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

// Interpreta o corpo das requisicoes com Content-Type: application/json.
app.use(express.json());
// #endregion

// #region health
// Primeira rota da API: responde sem consultar nada e sem depender do dominio.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
// #endregion

// #region data
// A "base de dados" desta etapa: um array em memoria, no proprio arquivo.
const tasks = [
  { id: 1, title: 'Estudar rotas do Express', done: true },
  { id: 2, title: 'Escrever a primeira API', done: false },
];

let nextId = 3;
// #endregion

// #region list
app.get('/tasks', (req, res) => {
  res.json(tasks);
});
// #endregion

// #region show
// O trecho ":id" e um parametro de rota: chega em req.params.id, sempre string.
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: 'Tarefa nao encontrada' });
  }

  res.json(task);
});
// #endregion

// #region create
// req.body so existe porque express.json() foi registrado antes desta rota.
app.post('/tasks', (req, res) => {
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

// #region listen
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
// #endregion
