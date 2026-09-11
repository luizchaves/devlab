// Compara a persistência em arquivo, sem SGBD, com a persistência em um banco
// relacional, usando as mesmas duas regras: e-mail único e id gerado.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

// #region file
// Em arquivo, cada gravação reescreve o JSON inteiro. Nada impede dois usuários
// com o mesmo e-mail, e uma segunda escrita apaga a primeira sem aviso.
const FILE = 'users.json';

function saveToFile(user) {
  const users = readUsers();
  users.push({ id: users.length + 1, ...user });
  writeFileSync(FILE, JSON.stringify(users));
}

function readUsers() {
  try {
    return JSON.parse(readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

saveToFile({ name: 'Ana', email: 'ana@example.com' });
saveToFile({ name: 'Ana de novo', email: 'ana@example.com' });

console.log('arquivo:', readUsers());
unlinkSync(FILE);
// #endregion file

// #region sqlite
// No SGBD, a regra "e-mail único" mora no esquema, e a segunda inserção é recusada.
const db = new DatabaseSync(':memory:');

db.exec('CREATE TABLE User (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)');

const insert = db.prepare('INSERT INTO User (name, email) VALUES (?, ?)');

insert.run('Ana', 'ana@example.com');

try {
  insert.run('Ana de novo', 'ana@example.com');
} catch (error) {
  console.log('sqlite recusou:', error.message);
}

console.log('sqlite:', db.prepare('SELECT * FROM User').all().map((row) => ({ ...row })));
// #endregion sqlite
