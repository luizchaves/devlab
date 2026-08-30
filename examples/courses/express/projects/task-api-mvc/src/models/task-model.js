/**
 * Model em memoria.
 *
 * O controller nunca manipula este array diretamente: ele so conhece as
 * funcoes exportadas aqui. Trocar por um banco de dados muda apenas este arquivo.
 */

// #region state
let tasks = [
  { id: 1, title: 'Estudar rotas do Express', done: true },
  { id: 2, title: 'Escrever a primeira API', done: false },
];

let nextId = 3;
// #endregion

// #region read
export function findAll() {
  return tasks;
}

export function findById(id) {
  return tasks.find((task) => task.id === id);
}
// #endregion

// #region write
export function create({ title, done = false }) {
  const task = { id: nextId, title, done };

  nextId += 1;
  tasks.push(task);

  return task;
}

export function update(id, data) {
  const task = findById(id);

  if (!task) return undefined;

  if (data.title !== undefined) task.title = data.title;
  if (data.done !== undefined) task.done = data.done;

  return task;
}

export function remove(id) {
  const sizeBefore = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  return tasks.length < sizeBefore;
}
// #endregion
