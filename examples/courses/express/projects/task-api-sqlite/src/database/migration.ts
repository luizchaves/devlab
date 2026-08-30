import { connect } from '#database/database.ts';

// #region up
/**
 * As restricoes do banco valem para toda origem — seed, script, consulta
 * manual — e nao so para o que passa pelo middleware de validacao.
 */
async function up() {
  const db = await connect();

  await db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER  PRIMARY KEY,
      title       TEXT     NOT NULL UNIQUE CHECK (LENGTH(title) >= 3),
      description TEXT,
      done        INTEGER  NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
      priority    TEXT     NOT NULL DEFAULT 'medium'
                           CHECK (priority IN ('low', 'medium', 'high')),
      dueDate     TEXT,
      createdAt   TEXT     NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.close();
}
// #endregion

await up();

console.log('Tabela tasks criada.');
