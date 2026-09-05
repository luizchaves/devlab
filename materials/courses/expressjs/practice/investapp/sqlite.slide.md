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
title: "InvestApp: SQLite nativo"
description: "Quinta etapa do InvestApp: persistência com node:sqlite, invólucro de promessas, migration, seeders e a camada de model isolando as consultas — sem ORM."
---

<!-- _class: lead -->

# InvestApp: SQLite nativo

Quinta etapa do InvestApp: persistência com node:sqlite, invólucro de promessas, migration, seeders e a camada de model isolando as consultas — sem ORM.

---

## Objetivo

- Entender o papel de **InvestApp: SQLite nativo** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-db-simple`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US06 — Não perder a carteira ao fechar o sistema · RF01, RNF03, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK06.1 · Criar `src/database/database.ts` (Conexão e invólucro de promessas), TK06.2 · Criar `src/database/migration.ts` e `src/database/seeders.ts` (Estrutura e dados), TK06.3 · Modificar `src/models/Investment.ts` (Consultas SQL no model)
- **Os scripts de banco**
- **Executando**
- **Testando**
- **O diff que importa**

---

## Contexto da Aula

- Etapa 6 de 13 · Nível Intermediário · TypeScript · Express.js · `node:sqlite`
- O array vira uma tabela. A API continua idêntica do lado de fora: o que muda é uma camada nova entre as rotas e os dados.
- Persistência SQL: veja Banco de Dados com SQLite Nativo e Operações CRUD em SQL

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT12 · Persistência de dados

---

## Requisitos, histórias e critérios: Tabela

- RNF03 Persistência Relacional: banco em arquivo com SQL escrito à mão, sem ORM | parcial: falta o ORM e as relações
- RF01 Gestão de Investimentos: o mesmo CRUD, agora gravando em disco | atendido

---

## US06 — Não perder a carteira ao fechar o sistema · RF01, RNF03

- Como investidor,
- quero que os meus investimentos continuem cadastrados depois de fechar o sistema,
- para não precisar recadastrar tudo a cada uso.

---

## US06 — Não perder a carteira ao fechar o sistema · RF01, RNF03: Exemplo

```txt
Cenário: CA06.1 - Preparar o banco
  Quando executo npm run db:load
  Então a tabela investments é criada
  E os dados iniciais são inseridos
Cenário: CA06.2 - Os dados sobrevivem ao reinício
  Dado um investimento cadastrado pela API
  Quando derrubo o servidor e subo de novo
  Quando envio GET /api/investments
  Então o investimento continua na lista
Cenário: CA06.3 - Nenhum valor entra na string SQL
  Quando abro src/models/Investment.ts
  Então todo valor é passado por "?" em um array de parâmetros
```

---

## Tasks da etapa

- As tarefas abaixo implementam US06 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK06.1 · Instalar o driver e criar `src/database/database.ts`: Conexão única com o arquivo SQLite, em uma API de promessas.
- TK06.2 · Criar `src/database/migration.ts` e `seeders.ts`: Scripts DDL de tabela e dados iniciais de teste.
- TK06.3 · Modificar `src/models/Investment.ts`: Substituição do array em memória por consultas SQL parametrizadas.

---

## Estrutura da aplicação

- A pasta `src/data/` sai inteira e dá lugar a `src/database/`, com quatro arquivos que separam três responsabilidades: conectar (`database.ts`), criar o...
- O `load.ts` só encadeia os dois últimos em um comando.

---

## O que muda nesta etapa

- O array em memória vira uma tabela SQLite. Do lado de fora a API é idêntica: mesmas rotas, mesmos status, mesma validação da etapa 4.
- O que muda é a camada de dados:
- O array `data/investments.ts` das etapas 3 e 4 é a única coisa que esta etapa remove.
- Tudo o mais: camadas, tipos, schemas do Zod, manipuladores de erro: vem intacto da etapa anterior.

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK06.1 · Criar `src/database/database.ts` (Conexão e invólucro de...

- Nenhuma dependência nova: o `node:sqlite` é módulo nativo do Node 22 em diante, importado na linha 2.
- A linha 4 fixa o caminho do arquivo com `resolve('src', 'database', 'db.sqlite')`, e é o único lugar da aplicação que sabe onde o banco vive.
- O problema que o arquivo resolve está no nome da classe: `DatabaseSync` é síncrona, e o resto da aplicação é `async` desde a etapa 3.
- O `createPromiseDatabase` das linhas 23 a 46 é o invólucro que uniformiza isso, expondo três métodos assíncronos: `run` para escrita (linha 25), `get`...
- É esse trio que a camada de model usa daqui em diante. Trocar de driver, ou até de banco, passa a ser reescrever este arquivo, e nada mais.

---

## TK06.2 · Criar `src/database/migration.ts` e...

- Estrutura e dados são responsabilidades distintas e por isso moram em arquivos distintos.
- A migration é o `CREATE TABLE` das linhas 7 a 12, executado pelo `db.run` da linha 14. Três colunas bastam nesta etapa.
- A linha 8 mantém `id TEXT PRIMARY KEY`: e não um `AUTOINCREMENT` numérico: porque o `paramsSchema` da etapa 4 exige que o `:id` da rota seja um UUID.
- Trocar o formato do id aqui quebraria a validação herdada.
- O seeder faz o outro lado: lê o `seeders.json` na linha 10 e, no laço das linhas 14 a 16, chama `Investment.create` para cada registro.

---

## TK06.3 · Modificar `src/models/Investment.ts` (Consultas SQL no model)

- O model mantém as mesmas cinco funções da etapa anterior, com as mesmas assinaturas tipadas.
- Quem chama: controller, seeder: não percebe diferença nenhuma; o que mudou foi só o corpo.
- O `mapRow` das linhas 6 a 12 é a fronteira entre o banco e o domínio: recebe um `Record`: uma linha crua, sem tipo: e devolve um `Investment`.
- É ele que permite ao resto da aplicação continuar trabalhando com tipos do domínio.
- O trecho destacado nas linhas 14 a 33 é o `create`, e mostra o formato que as outras repetem: montar a string SQL em um *template literal* e executar...

---

## Os scripts de banco

- O `package.json` ganha três scripts que tornam o banco descartável: e essa é a razão de migration e seeders existirem como arquivos versionados.
- Os dados iniciais ficam separados do código que os insere.
- O `seeders.json` é só a lista: trocar o conteúdo inicial do banco não exige tocar em nenhum `.ts`.
- O `db:load` da linha 9 cria a tabela e insere os dados; o `db:drop` da linha 10 apaga o arquivo inteiro; e o `db:reload` da linha 11 encadeia os dois.
- Recomeçar do zero é um comando, não um procedimento.

---

## Executando

- Entre na pasta desta etapa:
- Crie o banco e popule:
- Suba o servidor:
- Cadastre um investimento, derrube o servidor com Ctrl+C, suba de
- novo e liste: os dados continuam lá.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-db-simple
   npm install
```

---

## Executando: Exemplo 2

```bash
   npm run db:load
```

---

## Testando

- Nesta seção, testamos a persistência em banco de dados SQLite nativo.
- O cadastro do investimento envia dados JSON e persiste o registro na tabela SQLite em disco, retornando status `201 Created` com UUID gerado:
- { "name": "CDB Inter", "value": 15000 }
- { "id": "5c87a333-52c3-47b6-b8d6-e54576e0e12d", "name": "CDB Inter", "value": 15000 }
- A prova da etapa não está na resposta, e sim no que acontece depois: derrube o servidor com

---

## Testando: Exemplo

```txt
  ### Testar criação de investimento persistido no SQLite
  POST http://localhost:3000/api/investments
  Content-Type: application/json
  {
    "name": "CDB Inter",
    "value": 15000
  }
```

---

## O diff que importa

- As rotas e os schemas praticamente não mudam: continuam chamando `Investment.create`, `Investment.read` e `Investment.readById`.
- O que mudou foi dentro do model: que é exatamente o que a arquitetura em camadas promete.
- O padrão da mudança é sempre o mesmo: onde havia manipulação de array, passa a haver SQL parametrizado: e a assinatura da função não muda.
- Compare a leitura por id nas duas etapas.
- O `find` sobre um array virou um `WHERE id = ?` (linha 60) executado com `db.get` (linha 64).

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-validation/src \
  examples/courses/expressjs/projects/invest-app-db-simple/src || true
```

---

## Conceitos abordados

- Conexão SQLite isolada em um único arquivo
- SQL escrito à mão, sem ORM
- Consultas parametrizadas com `?` e prevenção de injeção de SQL
- Migration e seeders como scripts versionados
- Camada de model isolando o SQL das rotas

---

## Próxima etapa

- InvestApp: Prisma ORM: schema declarativo, migrations versionadas e relações.

---

## Arquivos-Chave da Aula

- **src/database/database.ts**: `examples/courses/expressjs/projects/invest-app-db-simple/src/database/database.ts` (linhas marcadas `2,4,25,31,35,48-50`)
- **src/database/migration.ts**: `examples/courses/expressjs/projects/invest-app-db-simple/src/database/migration.ts` (linhas marcadas `7-12,14`)
- **src/database/seeders.ts**: `examples/courses/expressjs/projects/invest-app-db-simple/src/database/seeders.ts` (linhas marcadas `10,14-16`)
- **src/database/load.ts**: `examples/courses/expressjs/projects/invest-app-db-simple/src/database/load.ts`
- **src/models/Investment.ts**: `examples/courses/expressjs/projects/invest-app-db-simple/src/models/Investment.ts` (linhas marcadas `6-12,14-33`)
- **src/database/seeders.json**: `examples/courses/expressjs/projects/invest-app-db-simple/src/database/seeders.json`

---

## Resumo da Aula

- **InvestApp: SQLite nativo** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
