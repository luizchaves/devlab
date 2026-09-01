import type { ListTasksQuery } from '#schemas/task.ts';
import type { Page, Priority, Task } from '#types/task.ts';

/**
 * Model em memoria.
 *
 * O controller nunca toca neste array: conhece apenas as funcoes exportadas
 * aqui. Trocar por Prisma muda somente este arquivo.
 */
let tasks: Task[] = [
  {
    id: 1,
    title: 'Estudar rotas do Express',
    description: 'Parametros de rota, query string e corpo',
    done: true,
    priority: 'high',
    dueDate: '2026-03-10',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Escrever a primeira API',
    description: null,
    done: false,
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-03-02T09:00:00.000Z',
  },
];

let nextId = 3;

// #region filter
/** Aplica os filtros da query string, um a um, sobre a colecao completa. */
function applyFilters(list: Task[], query: ListTasksQuery): Task[] {
  let result = list;

  if (query.done !== undefined) {
    result = result.filter((task) => task.done === (query.done === 'true'));
  }

  if (query.priority !== undefined) {
    result = result.filter((task) => task.priority === query.priority);
  }

  if (query.q !== undefined) {
    const term = query.q.toLowerCase();
    result = result.filter((task) => task.title.toLowerCase().includes(term));
  }

  return result;
}
// #endregion

// #region sort
/** `-campo` ordena decrescente; `campo`, crescente. */
function applySort(list: Task[], sort: ListTasksQuery['sort']): Task[] {
  const desc = sort.startsWith('-');
  const field = (desc ? sort.slice(1) : sort) as 'title' | 'dueDate' | 'createdAt';

  return [...list].sort((a, b) => {
    // Nulos vao sempre para o fim, independentemente da direcao.
    const left = a[field] ?? '';
    const right = b[field] ?? '';

    if (left === right) return 0;
    if (left === '') return 1;
    if (right === '') return -1;

    return desc ? right.localeCompare(left) : left.localeCompare(right);
  });
}
// #endregion

// #region paginate
export function findAll(query: ListTasksQuery): Page<Task> {
  const filtered = applySort(applyFilters(tasks, query), query.sort);
  const total = filtered.length;
  const start = (query.page - 1) * query.perPage;

  return {
    data: filtered.slice(start, start + query.perPage),
    meta: {
      page: query.page,
      perPage: query.perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.perPage)),
    },
  };
}
// #endregion

export function findById(id: number): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function findByTitle(title: string): Task | undefined {
  return tasks.find((task) => task.title === title);
}

// #region write
export function create(data: {
  title: string;
  description?: string | null | undefined;
  priority: Priority;
  dueDate?: string | null | undefined;
}): Task {
  const task: Task = {
    id: nextId,
    title: data.title,
    description: data.description ?? null,
    done: false,
    priority: data.priority,
    dueDate: data.dueDate ?? null,
    createdAt: new Date().toISOString(),
  };

  nextId += 1;
  tasks.push(task);

  return task;
}

export function update(
  id: number,
  data: Partial<Pick<Task, 'title' | 'description' | 'done' | 'priority' | 'dueDate'>>
): Task | undefined {
  const task = findById(id);

  if (!task) return undefined;

  Object.assign(task, data);

  return task;
}

export function remove(id: number): boolean {
  const sizeBefore = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  return tasks.length < sizeBefore;
}
// #endregion
