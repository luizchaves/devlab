// #region runner
// Executa arquivos .sql contra um SQLite em memória e imprime o resultado de cada
// instrução, para que a documentação mostre saídas reais em vez de escritas de memória.
//
//   node run.mjs crud.sql            # schema.sql + seed.sql + crud.sql
//   node run.mjs --all               # todos os arquivos, um banco novo para cada um
//
// Arquivos que começam com "-- standalone" rodam sem schema.sql e seed.sql.
import { readFileSync, readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const args = process.argv.slice(2);
const files = args.includes('--all') ? listSqlFiles('.') : args;

for (const file of files) {
  console.log(`\n== ${file} ==`);
  runFile(file);
}
// #endregion runner

// #region run-file
function runFile(file) {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');

  const source = readFileSync(file, 'utf8');
  const standalone = source.startsWith('-- standalone');

  if (!standalone) {
    db.exec(readFileSync('schema.sql', 'utf8'));
    db.exec(readFileSync('seed.sql', 'utf8'));
  }

  for (const statement of splitStatements(source)) {
    runStatement(db, statement);
  }

  db.close();
}
// #endregion run-file

// #region run-statement
// SELECT, WITH e PRAGMA devolvem linhas; EXPLAIN QUERY PLAN devolve o plano; DDL e
// controle de transação confirmam com "ok"; o restante devolve o número de linhas afetadas. Um erro não interrompe o arquivo: ele é impresso
// como saída, porque algumas páginas mostram de propósito uma instrução que falha.
function runStatement(db, statement) {
  const returnsRows = /^\s*(select|with|pragma|explain)\b/i.test(statement);
  const isPlan = /^\s*explain query plan\b/i.test(statement);
  const isDefinition = /^\s*(create|alter|drop|begin|commit|rollback|savepoint|release)\b/i.test(
    statement
  );

  try {
    if (isPlan) {
      // O plano de execução tem colunas internas; só o texto interessa
      for (const row of db.prepare(statement).all()) {
        console.log(`-- plano: ${row.detail}`);
      }
    } else if (returnsRows) {
      printTable(db.prepare(statement).all());
    } else if (isDefinition) {
      db.exec(statement);
      console.log('-- ok');
    } else {
      const { changes } = db.prepare(statement).run();
      console.log(`-- ${changes} linha(s) afetada(s)`);
    }
  } catch (error) {
    console.log(`-- erro: ${error.message}`);
  }
}
// #endregion run-statement

// #region helpers
function splitStatements(source) {
  return source
    .split(/;\s*\n/)
    .map((part) => part.replace(/^\s*--[^\n]*\n?/gm, '').trim())
    .filter(Boolean);
}

function printTable(rows) {
  if (rows.length === 0) {
    console.log('(0 linhas)');
    return;
  }

  const columns = Object.keys(rows[0]);
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => String(row[column] ?? 'NULL').length))
  );
  const line = (cells) => cells.map((cell, i) => String(cell).padEnd(widths[i])).join(' | ');

  console.log(line(columns));
  console.log(widths.map((width) => '-'.repeat(width)).join('-+-'));

  for (const row of rows) {
    console.log(line(columns.map((column) => row[column] ?? 'NULL')));
  }
}

function listSqlFiles(dir) {
  return readdirSync(dir, { recursive: true })
    .filter((name) => name.endsWith('.sql') && !['schema.sql', 'seed.sql'].includes(name))
    .sort();
}
// #endregion helpers
