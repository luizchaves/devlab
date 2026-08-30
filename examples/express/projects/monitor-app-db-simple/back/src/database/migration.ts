import Database from '@/database/database.ts';

async function up() {
  const db = await Database.connect();

  const hostsSql = `
    CREATE TABLE IF NOT EXISTS hosts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `;

  await db.run(hostsSql);

  await db.close();
}

export default { up };
