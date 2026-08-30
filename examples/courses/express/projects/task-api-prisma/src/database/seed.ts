import { prisma } from '#database/prisma.ts';

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
    tags: ['estudo'],
  },
  {
    title: 'Escrever a primeira API',
    description: null,
    done: false,
    priority: 'medium',
    dueDate: null,
    createdAt: new Date('2026-03-02T09:00:00.000Z'),
    tags: ['estudo', 'urgente'],
  },
];

for (const tag of tags) {
  // `upsert` deixa o seed idempotente: rodar duas vezes nao duplica nada.
  await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
}

for (const { tags: nomes, ...task } of tasks) {
  await prisma.task.upsert({
    where: { title: task.title },
    update: {},
    // `connect` liga a tarefa a tags que ja existem, em vez de criar novas.
    create: { ...task, tags: { connect: nomes.map((name) => ({ name })) } },
  });
}

console.log(`${tags.length} tags e ${tasks.length} tarefas semeadas.`);

await prisma.$disconnect();
