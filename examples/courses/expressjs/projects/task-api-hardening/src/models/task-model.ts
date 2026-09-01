import type { Prisma } from '@prisma/client';

import { prisma } from '#database/prisma.ts';
import type { ListTasksQuery } from '#schemas/task.ts';
import type { Page, Priority, Task } from '#types/task.ts';

// #region select
/**
 * O `include` diz quais relacoes vem junto. Sem ele, `task.tags` nem existe no
 * resultado — o Prisma nao carrega relacao por acidente.
 */
const withTags = { tags: { select: { id: true, name: true, color: true } } } as const;

type TaskRecord = Prisma.TaskGetPayload<{ include: typeof withTags }>;

/** O Prisma devolve `createdAt` como `Date`; a resposta HTTP usa ISO 8601. */
function toTask(record: TaskRecord): Task {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    done: record.done,
    priority: record.priority as Priority,
    dueDate: record.dueDate,
    createdAt: record.createdAt.toISOString(),
    tags: record.tags,
  };
}
// #endregion

// #region where
/**
 * Cada filtro vira uma chave do `where`; o Prisma monta o SQL e escapa tudo.
 *
 * O `userId` nao vem da query: ele e imposto pelo model a partir do token. E o
 * que garante que nenhum filtro do cliente consiga alcancar tarefa alheia.
 */
function buildWhere(userId: string, query: ListTasksQuery): Prisma.TaskWhereInput {
  return {
    userId,
    ...(query.done !== undefined ? { done: query.done === 'true' } : {}),
    ...(query.priority !== undefined ? { priority: query.priority } : {}),
    ...(query.q !== undefined ? { title: { contains: query.q } } : {}),
  };
}
// #endregion

// #region order
const COLUNAS_ORDENAVEIS = ['title', 'dueDate', 'createdAt'] as const;

function buildOrderBy(sort: ListTasksQuery['sort']): Prisma.TaskOrderByWithRelationInput[] {
  const desc = sort.startsWith('-');
  const coluna = desc ? sort.slice(1) : sort;

  if (!COLUNAS_ORDENAVEIS.includes(coluna as (typeof COLUNAS_ORDENAVEIS)[number])) {
    return [{ createdAt: 'desc' }, { id: 'asc' }];
  }

  // O id desempata: sem ele, linhas com o mesmo valor trocam de pagina.
  return [{ [coluna]: desc ? 'desc' : 'asc' }, { id: 'asc' }];
}
// #endregion

// #region find-all
export async function findAll(userId: string, query: ListTasksQuery): Promise<Page<Task>> {
  const where = buildWhere(userId, query);

  // As duas consultas usam o mesmo `where`; so a listagem tem skip/take.
  const [records, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: withTags,
      orderBy: buildOrderBy(query.sort),
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: records.map(toTask),
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
/**
 * Toda busca por id leva o `userId` junto.
 *
 * O controller responde 404 quando isto devolve `undefined`, entao a tarefa de
 * outra pessoa e indistinguivel de uma que nao existe — um 403 revelaria que o
 * id e valido e permitiria enumerar a base.
 */
export async function findById(userId: string, id: number): Promise<Task | undefined> {
  const record = await prisma.task.findFirst({ where: { id, userId }, include: withTags });

  return record ? toTask(record) : undefined;
}

export async function findByTitle(userId: string, title: string): Promise<Task | undefined> {
  const record = await prisma.task.findFirst({ where: { title, userId }, include: withTags });

  return record ? toTask(record) : undefined;
}
// #endregion

// #region create
export async function create(
  userId: string,
  data: {
    title: string;
    description?: string | null | undefined;
    priority: Priority;
    dueDate?: string | null | undefined;
  }
): Promise<Task> {
  const record = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      userId,
    },
    include: withTags,
  });

  return toTask(record);
}
// #endregion

// #region update
export async function update(
  userId: string,
  id: number,
  data: Partial<Pick<Task, 'title' | 'description' | 'done' | 'priority' | 'dueDate'>>
): Promise<Task | undefined> {
  // `updateMany` aceita o filtro composto; `update` so aceita chave unica.
  const { count } = await prisma.task.updateMany({ where: { id, userId }, data });

  return count > 0 ? findById(userId, id) : undefined;
}
// #endregion

// #region remove
export async function remove(userId: string, id: number): Promise<boolean> {
  // `deleteMany` devolve a contagem em vez de lancar quando nada casa.
  const { count } = await prisma.task.deleteMany({ where: { id, userId } });

  return count > 0;
}
// #endregion
