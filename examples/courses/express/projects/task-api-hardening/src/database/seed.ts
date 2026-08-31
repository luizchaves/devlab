import { prisma } from '#database/prisma.ts';
import { hashPassword } from '#utils/password.ts';

const users = [
  {
    name: 'Ana',
    email: 'ana@example.com',
    password: 'senha-de-desenvolvimento',
    role: 'admin',
  },
  {
    name: 'Bruno',
    email: 'bruno@example.com',
    password: 'senha-de-desenvolvimento',
    role: 'user',
  },
];

const tags = [
  { name: 'estudo', color: '#2563eb' },
  { name: 'urgente', color: '#dc2626' },
];

const tasks = [
  {
    title: 'Estudar rotas do Express',
    description: 'Parametros de rota, query string e corpo',
    done: true,
    priority: 'high',
    dueDate: '2026-03-10',
    createdAt: new Date('2026-03-01T09:00:00.000Z'),
    owner: 'ana@example.com',
    tags: ['estudo'],
  },
  {
    title: 'Escrever a primeira API',
    description: null,
    done: false,
    priority: 'medium',
    dueDate: null,
    createdAt: new Date('2026-03-02T09:00:00.000Z'),
    owner: 'ana@example.com',
    tags: ['estudo', 'urgente'],
  },
  {
    title: 'Revisar o guia de autenticacao',
    description: null,
    done: false,
    priority: 'low',
    dueDate: null,
    createdAt: new Date('2026-03-03T09:00:00.000Z'),
    owner: 'bruno@example.com',
    tags: ['estudo'],
  },
];

// #region seed
for (const { password, ...user } of users) {
  // `upsert` deixa o seed idempotente: rodar duas vezes nao duplica nada.
  await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    // A senha e semeada ja como hash: o texto em claro nunca chega ao banco.
    create: { ...user, password: hashPassword(password) },
  });
}

for (const tag of tags) {
  await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
}

for (const { owner, tags: nomes, ...task } of tasks) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: owner } });

  await prisma.task.upsert({
    where: { userId_title: { userId: user.id, title: task.title } },
    update: {},
    // `connect` liga a tarefa ao dono e a tags que ja existem.
    create: { ...task, userId: user.id, tags: { connect: nomes.map((name) => ({ name })) } },
  });
}
// #endregion

console.log(
  `${users.length} usuarios, ${tags.length} tags e ${tasks.length} tarefas semeados.`
);

await prisma.$disconnect();
