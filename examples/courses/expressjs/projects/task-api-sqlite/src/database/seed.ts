import { connect } from '#database/database.ts';

const tasks = [
  {
    title: 'Estudar rotas do Express',
    description: 'Parametros de rota, query string e corpo',
    done: 1,
    priority: 'high',
    dueDate: '2026-03-10',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    title: 'Escrever a primeira API',
    description: null,
    done: 0,
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-03-02T09:00:00.000Z',
  },
];

const db = await connect();

for (const task of tasks) {
  await db.run(
    `INSERT OR IGNORE INTO tasks (title, description, done, priority, dueDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [task.title, task.description, task.done, task.priority, task.dueDate, task.createdAt]
  );
}

await db.close();

console.log(`${tasks.length} tarefas semeadas.`);
