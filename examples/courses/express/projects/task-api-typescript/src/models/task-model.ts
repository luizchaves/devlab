import type { Task, TaskInput } from '#types/task.ts';

/**
 * Model em memoria.
 *
 * O controller nunca toca neste array: conhece apenas as funcoes exportadas
 * aqui. Trocar por Prisma muda somente este arquivo.
 */
let tasks: Task[] = [
  { id: 1, title: 'Estudar rotas do Express', done: true },
  { id: 2, title: 'Escrever a primeira API', done: false },
];

let nextId = 3;

// #region read
export function findAll(): Task[] {
  return tasks;
}

export function findById(id: number): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function findByTitle(title: string): Task | undefined {
  return tasks.find((task) => task.title === title);
}
// #endregion

// #region write
export function create({ title, done = false }: TaskInput & { title: string }): Task {
  const task: Task = { id: nextId, title, done };

  nextId += 1;
  tasks.push(task);

  return task;
}

export function update(id: number, data: TaskInput): Task | undefined {
  const task = findById(id);

  if (!task) return undefined;

  if (data.title !== undefined) task.title = data.title;
  if (data.done !== undefined) task.done = data.done;

  return task;
}

export function remove(id: number): boolean {
  const sizeBefore = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  return tasks.length < sizeBefore;
}
// #endregion
