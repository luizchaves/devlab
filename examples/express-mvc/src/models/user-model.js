/**
 * Model em memoria.
 *
 * O controller nunca manipula este array diretamente: ele so conhece as
 * funcoes exportadas aqui. Trocar por um banco de dados (veja o projeto
 * express-prisma) muda apenas este arquivo.
 */

let users = [
  { id: 1, name: 'Ana', email: 'ana@example.com' },
  { id: 2, name: 'Bruno', email: 'bruno@example.com' },
];

let nextId = 3;

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id);
}

export function create({ name, email }) {
  const user = { id: nextId, name, email };

  nextId += 1;
  users.push(user);

  return user;
}

export function update(id, data) {
  const user = findById(id);

  if (!user) return undefined;

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;

  return user;
}

export function remove(id) {
  const sizeBefore = users.length;

  users = users.filter((user) => user.id !== id);

  return users.length < sizeBefore;
}
