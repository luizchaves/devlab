---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Express.js: SQL com Node.js"
description: "Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma API Express."
---

<!-- _class: lead -->

# Express.js: SQL com Node.js

Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma API Express.

---

## Objetivo

- Ao final você saberá abrir uma conexão SQLite a partir do Node, executar consultas com *statements* preparados, escrever migrations e seeders, e...

---

## Mapa da Aula

- **Objetivo**
- **Por que começar sem ORM**
- **O módulo `node:sqlite`**
- **Statements preparados e injeção de SQL**
- **Um invólucro de promessas**
- **Migrations e seeders**
- **O model reescrito**
- **Estrutura do projeto**

---

## Contexto da Aula

- Até aqui os dados moravam em um array e desapareciam a cada reinício.
- Esta aula troca o model em memória por um banco SQLite real: usando o módulo `node:sqlite`, que vem com o próprio Node, sem nenhuma dependência.

---

## Por que começar sem ORM

- Um ORM esconde o SQL: e esconder algo que não se conhece é como se aprende a depender de mágica.
- Escrever as consultas primeiro dá três coisas:
- A trilha é deliberada: SQL puro aqui, Prisma na sequência.
- As duas versões resolvem o mesmo problema, e a comparação só é possível depois de ver as duas.

---

## Por que começar sem ORM: Tabela

- Entender o que o ORM gera: `include` deixa de ser mágica quando você já escreveu o `JOIN`
- Diagnosticar desempenho: consulta lenta se lê no SQL, não na chamada do ORM
- Trabalhar em projeto sem ORM: scripts, migrações e relatórios costumam ser SQL puro

---

## O módulo `node:sqlite`

- Desde o Node 22.5, o SQLite vem embutido.
- Não há `npm install`, arquivo binário para compilar nem servidor de banco para subir: o banco é um arquivo no disco.
- O nome não é decorativo: cada consulta bloqueia o event loop.
- Para SQLite local e consultas pequenas isso é aceitável e até mais rápido que a alternativa assíncrona.
- Para consultas pesadas, o bloqueio trava a aplicação inteira: é o momento de paginar, indexar ou trocar de banco.

---

## O módulo `node:sqlite`: Exemplo

```ts
const db = new DatabaseSync('src/database/db.sqlite');
db.exec(`CREATE TABLE IF NOT EXISTS investments (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT    NOT NULL,
  amount INTEGER NOT NULL
)`);
const insert = db.prepare('INSERT INTO investments (name, amount) VALUES (?, ?)');
const { lastInsertRowid } = insert.run('Tesouro Selic 2029', 20000);
const rows = db.prepare('SELECT * FROM investments').all();
```

---

## Statements preparados e injeção de SQL

- A diferença entre `?` e concatenação não é estilo: é a fronteira entre um sistema seguro e um invadido:
- Parâmetros também podem ser nomeados, o que ajuda em consultas com muitos campos:
- Parâmetros substituem valores, nunca nomes de tabela ou de coluna.

---

## Statements preparados e injeção de SQL: Exemplo 1

```ts
    // req.query.name === "x'; DROP TABLE investments; --"
    const sql = `SELECT * FROM investments WHERE name = '${name}'`;
    db.exec(sql); // executa os dois comandos
```

---

## Statements preparados e injeção de SQL: Exemplo 2

```ts
    const stmt = db.prepare('SELECT * FROM investments WHERE name = ?');
    // O valor é enviado separado do comando: nunca vira SQL.
    const rows = stmt.all(name);
```

---

## Um invólucro de promessas

- O restante da aplicação é `async`.
- Envolver o `DatabaseSync` em uma interface de promessas mantém o model uniforme e permite trocar o driver depois sem mexer nos chamadores:

---

## Um invólucro de promessas: Exemplo

```ts
function wrap(database: DatabaseSync) {
  return {
    async run(sql: string, params: unknown[] = []) {
      const { changes, lastInsertRowid } = database.prepare(sql).run(...params);
      return { changes, lastId: Number(lastInsertRowid) };
    },
    async get<T>(sql: string, params: unknown[] = []) {
      return database.prepare(sql).get(...params) as T | undefined;
    },
    async all<T>(sql: string, params: unknown[] = []) {
```

---

## Migrations e seeders

- Duas responsabilidades distintas, e confundi-las causa perda de dados:
- Os scripts do `package.json` transformam isso em comandos memorizáveis:
- Em desenvolvimento é conveniente; apontado para um banco de produção, é catastrófico.
- Scripts destrutivos devem depender de `DATABASE_URL` e não de um caminho fixo: veja Configuração.

---

## Migrations e seeders: Tabela

- Migration: cria e altera a estrutura | ao evoluir o schema
- Seeder: insere dados iniciais | ao preparar um ambiente de teste

---

## Migrations e seeders: Exemplo 1

```ts
export async function up() {
  const db = await Database.connect();
  await db.run(`
    CREATE TABLE IF NOT EXISTS investments (
      id        INTEGER  PRIMARY KEY AUTOINCREMENT,
      name      TEXT     NOT NULL,
      amount    INTEGER  NOT NULL CHECK (amount > 0),
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
```

---

## Migrations e seeders: Exemplo 2

```ts
export async function seed() {
  const db = await Database.connect();
  const sql = 'INSERT INTO investments (name, amount) VALUES (?, ?)';
  for (const { name, amount } of seeders.investments) {
    await db.run(sql, [name, amount]);
  }
}
```

---

## O model reescrito

- Esta é a prova de que a arquitetura em camadas valeu a pena: só o model muda. Controller, router e middlewares permanecem intactos.
- O CRUD completo cabe em quatro consultas:
- As funções continuam se chamando `findAll`, `findById`, `create`, `update` e `remove`.
- O controller passa a usar `await`, e nada mais muda: inclusive as respostas HTTP. É exatamente o efeito que a aula de MVC prometeu.

---

## O model reescrito: Exemplo 1

```ts
export function findAll() {
  return investments;
}
export async function findAll(): Promise<Investment[]> {
  const db = await Database.connect();
  return db.all<Investment>('SELECT * FROM investments ORDER BY id');
}
```

---

## O model reescrito: Exemplo 2

```ts
export async function findById(id: number) {
  const db = await Database.connect();
  return db.get<Investment>('SELECT * FROM investments WHERE id = ?', [id]);
}
export async function create({ name, amount }: InvestmentInput) {
  const db = await Database.connect();
  const { lastId } = await db.run(
    'INSERT INTO investments (name, amount) VALUES (?, ?)',
    [name, amount],
  );
```

---

## Estrutura do projeto

- Versione a migration e os seeders, que reconstroem o banco a qualquer momento.

---

## Executando

- Crie a estrutura e popule com os dados iniciais:
- Suba o servidor:
- Confirme que os dados sobrevivem ao reinício: crie um investimento, derrube o servidor
- com Ctrl+C, suba de novo e liste.
- Inspecione o arquivo com a extensão

---

## Executando: Exemplo 1

```bash
   npm run db:load
```

---

## Executando: Exemplo 2

```bash
   npm run dev
```

---

## Exercício

- Partindo do projeto `express-typescript`:
- Crie `src/database/database.ts` com o invólucro de promessas.
- Escreva a migration da tabela `users` com `email` `UNIQUE` e `NOT NULL`.
- Reescreva `user-model.ts` usando SQL, mantendo os nomes das funções.
- Ajuste o controller para `await`: e confirme que nada mais precisou mudar.

---

## Exercício: Exemplo

```ts
  export async function create({ name, email }: Required<UserInput>): Promise<User> {
    const db = await Database.connect();
    const { lastId } = await db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email],
    );
    return { id: lastId, name, email };
  }
```

---

## Desafio

- Implemente `findAll` com paginação e filtro por nome montando o SQL dinamicamente: sem concatenar valores.
- Dica: monte um array de condições e um array de parâmetros em paralelo, e junte as condições com `' AND '`.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## `node:sqlite`

- Por que `DatabaseSync` ser síncrono importa em um servidor?
- Porque cada consulta bloqueia o event loop: enquanto ela roda, nenhuma outra requisição é atendida.
- Para consultas pequenas em SQLite local é aceitável; uma consulta pesada trava a aplicação inteira.
- Qual a diferença entre `db.exec` e `stmt.run`?

---

## Segurança e organização

- Por que `?` impede injeção de SQL?
- Porque comando e valores viajam separados: o banco compila o comando primeiro e só depois recebe os dados.
- O conteúdo do parâmetro nunca é interpretado como SQL.
- O que `?` não protege?
- Nomes de tabela e de coluna, que não podem ser parametrizados.

---

## Na prática

- A etapa correspondente do projeto é InvestApp: SQLite nativo.

---

## Próxima aula

- Prisma: as mesmas operações através de um ORM.

---

## Resumo da Aula

- **Express.js: SQL com Node.js** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
