import { connect, type DbParam } from '#database/database.ts';
import type { ListTasksQuery } from '#schemas/task.ts';
import type { Page, Priority, Task } from '#types/task.ts';

// #region row
/**
 * O SQLite nao tem booleano: `done` vai e volta como 0 ou 1. A conversao mora
 * aqui, para que o controller e a resposta HTTP nunca vejam o formato do banco.
 */
interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  done: number;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}

function toTask(row: Record<string, unknown>): Task {
  const { id, title, description, done, priority, dueDate, createdAt } = row as unknown as TaskRow;

  // Os campos sao listados na ordem da interface: a resposta HTTP tem o mesmo
  // formato das etapas anteriores, mesmo com os dados vindo agora do banco.
  return { id, title, description, done: done === 1, priority, dueDate, createdAt };
}
// #endregion

// #region where
/** Cada filtro vira um pedaco de `WHERE` e um parametro — nunca interpolacao. */
function buildWhere(query: ListTasksQuery): { clause: string; params: DbParam[] } {
  const conditions: string[] = [];
  const params: DbParam[] = [];

  if (query.done !== undefined) {
    conditions.push('done = ?');
    params.push(query.done === 'true' ? 1 : 0);
  }

  if (query.priority !== undefined) {
    conditions.push('priority = ?');
    params.push(query.priority);
  }

  if (query.q !== undefined) {
    conditions.push('LOWER(title) LIKE ?');
    params.push(`%${query.q.toLowerCase()}%`);
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
}
// #endregion

// #region order
/**
 * O `sort` vira **nome de coluna**, entao ele nunca pode ser interpolado direto:
 * o valor e checado contra a lista de permitidos antes de entrar no SQL.
 */
const COLUNAS_ORDENAVEIS = ['title', 'dueDate', 'createdAt'] as const;

function buildOrderBy(sort: ListTasksQuery['sort']): string {
  const desc = sort.startsWith('-');
  const coluna = desc ? sort.slice(1) : sort;

  if (!COLUNAS_ORDENAVEIS.includes(coluna as (typeof COLUNAS_ORDENAVEIS)[number])) {
    return 'ORDER BY createdAt DESC, id ASC';
  }

  // O id desempata: sem ele, linhas com o mesmo valor trocam de pagina.
  return `ORDER BY ${coluna} ${desc ? 'DESC' : 'ASC'}, id ASC`;
}
// #endregion

// #region find-all
export async function findAll(query: ListTasksQuery): Promise<Page<Task>> {
  const db = await connect();
  const { clause, params } = buildWhere(query);

  // O COUNT usa os mesmos filtros da listagem, e nenhum dos dois usa LIMIT.
  const totalRow = await db.get(`SELECT COUNT(*) AS total FROM tasks ${clause}`, params);
  const total = Number(totalRow?.total ?? 0);

  const rows = await db.all(
    `SELECT * FROM tasks ${clause} ${buildOrderBy(query.sort)} LIMIT ? OFFSET ?`,
    [...params, query.perPage, (query.page - 1) * query.perPage]
  );

  await db.close();

  return {
    data: rows.map(toTask),
    meta: {
      page: query.page,
      perPage: query.perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.perPage)),
    },
  };
}
// #endregion

// #region find-by
export async function findById(id: number): Promise<Task | undefined> {
  const db = await connect();
  const row = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

  await db.close();

  return row ? toTask(row) : undefined;
}

export async function findByTitle(title: string): Promise<Task | undefined> {
  const db = await connect();
  const row = await db.get('SELECT * FROM tasks WHERE title = ?', [title]);

  await db.close();

  return row ? toTask(row) : undefined;
}
// #endregion

// #region create
export async function create(data: {
  title: string;
  description?: string | null | undefined;
  priority: Priority;
  dueDate?: string | null | undefined;
}): Promise<Task> {
  const db = await connect();

  const { lastInsertRowid } = await db.run(
    `INSERT INTO tasks (title, description, priority, dueDate, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description ?? null,
      data.priority,
      data.dueDate ?? null,
      new Date().toISOString(),
    ]
  );

  const row = await db.get('SELECT * FROM tasks WHERE id = ?', [lastInsertRowid]);

  await db.close();

  return toTask(row as Record<string, unknown>);
}
// #endregion

// #region update
const CAMPOS_ATUALIZAVEIS = ['title', 'description', 'done', 'priority', 'dueDate'] as const;

export async function update(
  id: number,
  data: Partial<Pick<Task, 'title' | 'description' | 'done' | 'priority' | 'dueDate'>>
): Promise<Task | undefined> {
  const entries = CAMPOS_ATUALIZAVEIS.filter((campo) => data[campo] !== undefined).map((campo) => {
    const valor = data[campo];

    return [campo, typeof valor === 'boolean' ? Number(valor) : (valor ?? null)] as const;
  });

  if (entries.length === 0) return findById(id);

  const db = await connect();

  const { changes } = await db.run(
    `UPDATE tasks SET ${entries.map(([campo]) => `${campo} = ?`).join(', ')} WHERE id = ?`,
    [...entries.map(([, valor]) => valor as DbParam), id]
  );

  const row = changes > 0 ? await db.get('SELECT * FROM tasks WHERE id = ?', [id]) : undefined;

  await db.close();

  return row ? toTask(row) : undefined;
}
// #endregion

// #region remove
export async function remove(id: number): Promise<boolean> {
  const db = await connect();
  const { changes } = await db.run('DELETE FROM tasks WHERE id = ?', [id]);

  await db.close();

  return changes > 0;
}
// #endregion
