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
title: "MonitorApp: SQLite nativo"
description: "Sexta etapa do MonitorApp: o array em memória dá lugar a um banco SQLite com o módulo node:sqlite, com migration, seeders e um model escrito em SQL parametrizado."
---

<!-- _class: lead -->

# MonitorApp: SQLite nativo

Sexta etapa do MonitorApp: o array em memória dá lugar a um banco SQLite com o módulo node:sqlite, com migration, seeders e um model escrito em SQL parametrizado.

---

## Objetivo

- Entender o papel de **MonitorApp: SQLite nativo** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-db-simple`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US06 — Não perder o inventário ao fechar o sistema · RF01, RNF03, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK06.1 · Criar `src/database/database.ts` (A conexão), TK06.2 · Criar `migration.ts`, `seeders.ts` e `load.ts` (A preparação do banco), TK06.3 · Reescrever `src/models/Host.ts` (O model em SQL)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 6 de 13 · Nível Intermediário · `node:sqlite` · SQL
- Até aqui, um `Ctrl+C` apagava o inventário.
- Esta etapa resolve isso com o banco relacional mais simples possível: um arquivo SQLite: e sem instalar nenhuma dependência: o módulo `node:sqlite` faz...
- A escolha de fazer isso sem ORM é deliberada.
- Escrever o SQL à mão uma vez deixa claro o que o Prisma vai passar a fazer na etapa 7, e por que ele vale a pena.

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT12 · Persistência de dados

---

## Requisitos, histórias e critérios: Tabela

- RF01 Gestão de Hosts: o CRUD agora sobrevive ao reinício | atendido
- RNF03 Persistência Relacional: tabela `hosts` em SQLite, sem ORM | parcial: faltam as relações

---

## US06 — Não perder o inventário ao fechar o sistema · RF01, RNF03

- Como responsável pela rede,
- quero que os hosts cadastrados continuem lá depois de reiniciar o servidor,
- para não precisar recadastrar tudo a cada execução.

---

## US06 — Não perder o inventário ao fechar o sistema · RF01, RNF03: Exemplo

```txt
Cenário: CA06.1 - Preparar o banco
  Quando executo npm run db:load
  Então a tabela hosts é criada
  E os registros iniciais são inseridos
Cenário: CA06.2 - Os dados sobrevivem ao reinício
  Dado um host cadastrado pela API
  Quando reinicio o servidor
  E envio GET /api/hosts
  Então o host continua na lista
Cenário: CA06.3 - Nenhum valor entra concatenado no SQL
  Dado o arquivo models/Host.ts
  Então todo valor vindo da requisição entra por um marcador ?
```

---

## Tasks da etapa

- TK06.1 · Criar `src/database/database.ts`: o invólucro assíncrono sobre `node:sqlite`.
- TK06.2 · Criar `migration.ts`, `seeders.ts` e `load.ts`: a preparação do banco em um comando.
- TK06.3 · Reescrever `src/models/Host.ts`: as cinco operações em SQL parametrizado.

---

## Estrutura da aplicação

- A pasta `src/data/` sai inteira e dá lugar a `src/database/`, com quatro arquivos que separam três responsabilidades distintas: conectar...
- O `load.ts` só encadeia os dois últimos em um comando.

---

## O que muda nesta etapa

- Esta é a primeira das duas remoções do trilho. A pasta `src/data/` sai inteira, porque o array que ela exportava foi substituído pelo banco.
- Controllers, rotas, schemas e o documento OpenAPI não mudaram.
- É a prova de que a divisão em camadas da etapa 3 valeu a pena: a troca de armazenamento ficou contida em um arquivo.

---

## O que muda nesta etapa: Tabela

- dados voltam ao estado inicial a cada reinício: dados vivem em `src/database/db.sqlite`
- —: scripts `db:load`, `db:drop` e `db:reload`

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Sexta etapa do MonitorApp: o array em memória dá lugar a um banco SQLite com o módulo node:sqlite, com migration, seeders e um model escrito em SQL...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK06.1 · Criar `src/database/database.ts` (A conexão)

- Nenhum `npm install` aqui: o `node:sqlite` já vem no Node.
- O módulo expõe a classe `DatabaseSync`, e o nome não é acidente: a API dele é síncrona.
- Todo o resto da aplicação, porém, é `async` desde a etapa 3.
- Em vez de espalhar essa diferença pelo model, este arquivo a resolve em um lugar só.
- O trecho destacado nas linhas 23 a 46 é esse invólucro.

---

## TK06.2 · Criar `migration.ts`, `seeders.ts` e `load.ts` (A...

- A migration é o esquema, escrito em SQL.
- O `CREATE TABLE IF NOT EXISTS` das linhas 6 a 12 descreve a única tabela desta etapa, com os mesmos três campos que o array tinha.
- O `id` é `TEXT`, e não `INTEGER PRIMARY KEY AUTOINCREMENT`, porque quem gera o identificador continua sendo a aplicação, com `randomUUID()`.
- O seeder faz a carga inicial, e faz isso pelo model, não por `INSERT` direto.
- A consequência é que os dados semeados passam pelas mesmas regras que os dados criados pela API: inclusive a geração do UUID.

---

## TK06.2 · Criar `migration.ts`, `seeders.ts` e `load.ts` (A...: Exemplo

```bash
npm run db:load     # cria a tabela e semeia
npm run db:drop     # apaga o arquivo do banco
npm run db:reload   # recomeça do zero
```

---

## TK06.3 · Reescrever `src/models/Host.ts` (O model em SQL)

- A assinatura das cinco funções é idêntica à da etapa 3: mesmos parâmetros, mesmos retornos, mesmos `throw new Error`. Só o miolo mudou.
- O `mapRow` da linha 6 é a primeira novidade: o banco devolve linhas genéricas, e alguém precisa convertê-las no tipo `Host`.
- Concentrar isso em uma função evita repetir a conversão em cada consulta.
- O `create` destacado nas linhas 14 a 34 mostra o padrão do arquivo.
- O SQL vive em um template literal (linhas 23 a 28), legível e indentado, e os valores não aparecem nele: entram como array no segundo argumento de...

---

## Executando

- Prepare o banco e suba a API:
- Suba o front:
- Cadastre um host pela tela, pare a API com `Ctrl+C`, suba de novo e recarregue a página. O
- host continua lá.
- O diff toca `database/`, `models/Host.ts` e nada mais.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-db-simple/back
   npm install
   npm run db:load
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-db-simple/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- Invólucro assíncrono sobre uma API síncrona
- SQL parametrizado com `?` e a defesa contra injeção
- Migration e seeders como scripts do projeto
- Reler o registro gravado em vez de montar a resposta na mão

---

## Próxima etapa

- MonitorApp: Prisma e relações: schema declarativo, migrations versionadas e o domínio ganha `Ping` e `Tag`.

---

## Arquivos-Chave da Aula

- **back/src/database/database.ts**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/database/database.ts` (linhas marcadas `23-46`)
- **back/src/database/migration.ts**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/database/migration.ts` (linhas marcadas `6-14`)
- **back/src/database/seeders.ts**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/database/seeders.ts`
- **back/src/database/load.ts**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/database/load.ts`
- **back/src/models/Host.ts**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/models/Host.ts` (linhas marcadas `14-34`)
- **back/src/database/seeders.json**: `examples/courses/expressjs/projects/monitor-app-db-simple/back/src/database/seeders.json`

---

## Resumo da Aula

- **MonitorApp: SQLite nativo** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
