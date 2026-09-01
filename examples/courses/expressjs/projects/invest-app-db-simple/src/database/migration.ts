import Database from '@/database/database.ts';

async function up() {
  const db = await Database.connect();

  const investmentsSql = `
    CREATE TABLE IF NOT EXISTS investments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      value INTEGER NOT NULL
    )
  `;

  await db.run(investmentsSql);

  await db.close();
}

export default { up };
