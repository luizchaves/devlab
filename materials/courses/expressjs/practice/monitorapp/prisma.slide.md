---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: Prisma e relações"
description: "Sétima etapa do MonitorApp: schema declarativo com Prisma, migrations versionadas e o domínio ganha o histórico de pings (um-para-muitos) e as tags (muitos-para-muitos)."
---

<!-- _class: lead -->

# MonitorApp: Prisma e relações

Sétima etapa do MonitorApp: schema declarativo com Prisma, migrations versionadas e o domínio ganha o histórico de pings (um-para-muitos) e as tags (muitos-para-muitos).

---

## Objetivo

- Entender o papel de **MonitorApp: Prisma e relações** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/monitor-app-prisma`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US07 — Organizar e comparar os hosts · RF02, RF03, RNF03, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK07.1 · Escrever `prisma/schema.prisma` (O modelo declarativo), TK07.2 · Criar o client e o `seed.ts`, TK07.3 · Reescrever os models
- **Testando**
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 7 de 13 · Nível Avançado · Prisma ORM · Relações 1-N e N-N
- Esta é a etapa em que o MonitorApp deixa de ser um CRUD e passa a ter um domínio.
- Duas entidades novas entram, e cada uma traz um tipo diferente de relação:
- pertence a exatamente um host: uma relação um-para-muitos.
- uma relação muitos-para-muitos, que exige uma tabela de junção.

---

## Requisitos, histórias e critérios

- Épico EP01 · Inventário e Observação › Feature FT03 · Classificação e histórico

---

## Requisitos, histórias e critérios: Tabela

- RF02 Classificação por Tags: tabela `Tag`, relação N-N e filtro `?tag=` | atendido
- RF03 Histórico de Medições: tabela `Ping` e a rota de histórico | parcial: falta medir de verdade
- RNF03 Persistência Relacional: Prisma, migrations versionadas e integridade referencial | atendido

---

## US07 — Organizar e comparar os hosts · RF02, RF03, RNF03

- Como responsável pela rede,
- quero rotular os hosts por finalidade e consultar o histórico de cada um,
- para enxergar o comportamento de um grupo de máquinas ao longo do tempo.

---

## US07 — Organizar e comparar os hosts · RF02, RF03, RNF03: Exemplo

```txt
Cenário: CA07.1 - As tabelas nascem da migration
  Quando executo npm run db:migrate
  Então são criadas as tabelas Host, Ping, Tag e a junção _HostTags
Cenário: CA07.2 - A listagem já vem resolvida
  Quando envio GET /api/hosts
  Então cada host traz o array tags preenchido
  E o array pings com as medições mais recentes
Cenário: CA07.3 - Tag nova é criada na hora
  Quando cadastro um host com a tag "backup", que não existe
  Então o host é criado com a tag conectada
  E a tag passa a existir para os próximos hosts
```

---

## Tasks da etapa

- TK07.1 · Escrever `prisma/schema.prisma`: `Host`, `Ping`, `Tag` e as duas relações.
- TK07.2 · Criar o client em `database.ts` e o `seed.ts`: uma instância e a carga inicial.
- TK07.3 · Reescrever os models: `Host` com `include`, e os novos `Tag` e `Ping`.
- TK07.4 · Criar as rotas de tags e de pings: dois recursos novos na API.
- TK07.5 · Ligar o front: badges de tag, filtro e a tela de histórico deixando de ser estática.

---

## Estrutura da aplicação

- É a etapa com o maior delta do trilho, e a árvore mostra por quê: o domínio triplica de tamanho.
- Cada entidade nova traz o seu conjunto completo de camadas: tipo, model, controller, rota e schema —, e a pasta `prisma/` aparece pela primeira vez, ao...

---

## O que muda nesta etapa

- Esta é a segunda e última remoção do trilho: os scripts de migration manual da etapa 6 saem, porque o Prisma assume o versionamento do esquema.

---

## O que muda nesta etapa: Tabela

- uma entidade: três entidades e uma tabela de junção
- um recurso na API: três: `hosts`, `tags` e `pings`

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Sétima etapa do MonitorApp: schema declarativo com Prisma, migrations versionadas e o domínio ganha o histórico de pings (um-para-muitos) e as tags...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK07.1 · Escrever `prisma/schema.prisma` (O modelo declarativo)

- O schema descreve o domínio inteiro em 37 linhas. Vale lê-lo por relação.
- Um-para-muitos: o `pings Ping[]` da linha 17 no `Host` e o par `host` / `hostId` das linhas 28 e 29 no `Ping` são os dois lados da mesma relação.
- A chave estrangeira mora no lado "muitos", como em qualquer modelo relacional.
- O `onDelete: Cascade` da linha 28 é uma decisão de domínio: uma medição não faz sentido sem o host que a originou, então apagar o host apaga o histórico.
- Muitos-para-muitos: o `tags Tag[] @relation("HostTags")` da linha 19 e o `hosts Host[] @relation("HostTags")` da linha 36 são o outro par.

---

## TK07.1 · Escrever `prisma/schema.prisma` (O modelo declarativo): Exemplo

```bash
npm install prisma @prisma/client @prisma/adapter-better-sqlite3
cp .env.example .env
```

---

## TK07.2 · Criar o client e o `seed.ts`

- O `database.ts` foi reescrito de ponta a ponta, mas continua exportando uma coisa só: a conexão.
- Do Prisma 7 em diante o client recebe um *driver adapter* (linha 9): quem fala com o SQLite é o driver `better-sqlite3`, e não mais um binário próprio...
- A linha 12 cria uma única instância, importada por todos os models. Criar um `PrismaClient` por model esgotaria o pool de conexões.
- O `prisma.config.ts` é onde a configuração de ambiente passou a viver a partir do Prisma 7: a string de conexão e o comando de seed saíram do...
- Repare no `process.loadEnvFile()`: o Node carrega o `.env` nativamente desde a versão 20.6, e o projeto não instala `dotenv` em nenhuma etapa.

---

## TK07.3 · Reescrever os models

- O `Host.ts` é o arquivo mais interessante da etapa. Duas constantes no topo carregam quase toda a decisão.
- O `include` das linhas 8 a 11 substitui o `JOIN` que seria escrito à mão: ele pede ao Prisma que traga as tags e as dez medições mais recentes na mesma...
- O `take: 10` é deliberado: o cartão do painel mostra a última latência e nada mais; carregar o histórico inteiro de todos os hosts para desenhar uma...
- O `connectTags` das linhas 14 a 21 resolve o cadastro por nome.
- O `connectOrCreate` da linha 16 é a operação que faz `tags: ["infra", "backup"]` funcionar mesmo quando `backup` ainda não existe: existe, conecta; não...

---

## TK07.4 · Criar as rotas de tags e de pings

- O histórico é um recurso aninhado: `GET /api/hosts/:id/pings`.
- A escolha do caminho é semântica: uma medição não existe fora de um host, e o URL diz isso.
- O controller confere a existência do host antes de ler o histórico.
- Sem essa checagem, um id inexistente devolveria `[]` com status `200`, o que é indistinguível de um host sem medições.
- O recurso de tags é mais simples, com duas rotas.

---

## TK07.4 · Criar as rotas de tags e de pings: Tabela

- GET: `/api/hosts?name=&tag=` |: | `200` | `400`
- POST: `/api/hosts` | `{ name, address, tags? }` | `201` | `400`
- GET: `/api/hosts/:id` |: | `200` | `400`, `404`
- PUT: `/api/hosts/:id` | `{ name, address, tags? }` | `200` | `400`, `404`
- DELETE: `/api/hosts/:id` |: | `204` | `400`, `404`
- GET: `/api/hosts/:id/pings` |: | `200` | `400`, `404`

---

## TK07.5 · Ligar o front (badges, filtro e histórico)

- O `index.js` ganha três coisas.
- O `lastPing` da linha 11 lê a primeira medição do array que o `include` trouxe: é ela que decide a cor da pastilha e o valor da barra.
- O componente `Tag` da linha 15 transforma cada rótulo em um badge, passando a cor gravada no banco para a variável CSS `--tag-color` que a etapa 1 já...
- E o `loadHostCards` da linha 71 monta a query string com o filtro, quando ele existe.
- O `host.js` é novo e existe para uma única tela.

---

## Testando

- Nesta seção, testamos a criação de hosts vinculados a tags via Prisma ORM (`connectOrCreate`).
- O envio de um novo host com tags (`POST /api/hosts`) associa as tags existentes e cria dinamicamente novas tags não cadastradas, retornando a entidade...
- { "name": "Servidor de backup", "address": "10.0.0.9", "tags": ["infra", "backup"] }
- { "id": "…", "name": "Servidor de backup", "address": "10.0.0.9", "createdAt": "2026-03-01T12:00:00.000Z", "tags": [ { "id": "…", "name": "infra",...
- A tag `backup` não existia e foi criada com a cor neutra; a `infra`, que já existia, manteve a cor original. É o `connectOrCreate` em ação.

---

## Testando: Exemplo

```txt
  ### Cadastrar host com tags usando Prisma connectOrCreate
  POST http://localhost:3000/api/hosts
  Content-Type: application/json
  {
    "name": "Servidor de backup",
    "address": "10.0.0.9",
    "tags": ["infra", "backup"]
  }
```

---

## Executando

- Prepare o banco e suba a API:
- Suba o front:
- Clique em Histórico em qualquer cartão: a tela abre com `?id=` e desenha a série vinda do
- Inspecione o banco com a interface do Prisma:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/monitor-app-prisma/back
   npm install
   cp .env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/express/projects/monitor-app-prisma/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- Schema declarativo e migrations versionadas
- Relação um-para-muitos com `onDelete: Cascade`
- Relação muitos-para-muitos e a tabela de junção implícita
- Campo opcional (`Int?`) como modelagem honesta da ausência
- Recurso aninhado no URL (`/hosts/:id/pings`)

---

## Próxima etapa

- MonitorApp: Ping real: o servidor executa o comando do sistema e passa a produzir os próprios dados.

---

## Arquivos-Chave da Aula

- **back/prisma/schema.prisma**: `examples/courses/express/projects/monitor-app-prisma/back/prisma/schema.prisma` (linhas marcadas `17,19,25,28,36`)
- **back/prisma/migrations/20260301000000_init/migration.sql**: `examples/courses/express/projects/monitor-app-prisma/back/prisma/migrations/20260301000000_init/migration.sql` (linhas marcadas `27-32,38-41`)
- **back/src/database/database.ts**: `examples/courses/express/projects/monitor-app-prisma/back/src/database/database.ts` (linhas marcadas `9,12`)
- **back/prisma.config.ts**: `examples/courses/express/projects/monitor-app-prisma/back/prisma.config.ts`
- **back/src/database/seed.ts**: `examples/courses/express/projects/monitor-app-prisma/back/src/database/seed.ts` (linhas marcadas `17,24,26-33`)
- **back/src/models/Host.ts**: `examples/courses/express/projects/monitor-app-prisma/back/src/models/Host.ts` (linhas marcadas `8-21,38,64`)

---

## Resumo da Aula

- **MonitorApp: Prisma e relações** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
