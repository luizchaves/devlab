---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: MonitorApp"
description: "Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma com relações, ping real, usuário, autenticação, tempo real, testes e Docker."
---

<!-- _class: lead -->

# Projeto: MonitorApp

Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma com relações, ping real, usuário, autenticação, tempo real, testes e Docker.

---

## Objetivo

- O MonitorApp visa fornecer um painel web para acompanhar a disponibilidade e a latência de hosts de rede.
- O sistema permite cadastrar endereços (IPv4 ou nome de domínio), organizá-los por tags, disparar medições sob demanda ou em intervalos automáticos, e...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/monitor-app-test`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Análise de requisitos**: Público-alvo
- **Objetivo do sistema**: Requisitos Funcionais (RF), Requisitos Não-Funcionais (RNF)
- **Stack tecnológica da aplicação**
- **Arquitetura do sistema**
- **Protótipo visual e telas principais**
- **Modelo de domínio e dicionário de dados**: Dicionário de dados do domínio
- **Trilha incremental de desenvolvimento**
- **Matriz comparativa das treze etapas**

---

## Contexto da Aula

- Nível Iniciante → Avançado · HTML · Tailwind CSS · Vite · Node.js · Express.js · TypeScript · Prisma · Testes
- O MonitorApp é o projeto irmão do InvestApp: a mesma trilha incremental, o mesmo rigor de camadas, mas outro domínio e outra arquitetura de front.
- Aqui a aplicação cadastra hosts de rede, executa `ping` periodicamente e guarda o histórico de latência de cada um: e o front-end tem build próprio,...

---

## Análise de requisitos

- Análise de requisitos aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Público-alvo

- O MonitorApp foi projetado para atender a dois perfis principais de usuários:
- Estudantes e Desenvolvedores Web: alunos que já percorreram o InvestApp e querem exercitar as mesmas camadas em um domínio com relação...
- Times de infraestrutura e professores de laboratório: pessoas que precisam de um painel simples e privado para acompanhar se um conjunto de máquinas,...

---

## Requisitos Funcionais (RF)

- Requisitos Funcionais (RF) aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Requisitos Funcionais (RF): Tabela

- RF01: Gestão de Hosts (CRUD) | O sistema deve permitir criar, listar, consultar por id, atualizar e remover hosts com nome e endereço (IPv4 ou nome de...
- RF02: Classificação por Tags | O sistema deve permitir rotular cada host com várias tags, e cada tag deve poder rotular vários hosts, com filtro da...
- RF03: Histórico de Medições | O sistema deve registrar cada medição de um host com o resultado (sucesso ou falha), a latência em milissegundos e o...
- RF04: Coleta Automática e Sob Demanda | O sistema deve executar `ping` real contra os hosts em intervalos configuráveis e permitir antecipar uma...
- RF05: Cadastro de Usuários | O sistema deve permitir o auto-cadastro de novos usuários informando nome, e-mail único e senha.
- RF06: Autenticação & Sessão | O sistema deve autenticar usuários via e-mail e senha, retornando um token de acesso JWT para manter a sessão ativa.

---

## Requisitos Não-Funcionais (RNF)

- A decomposição completa dos requisitos em 5 épicos, 14 features, 15 histórias de usuário, 80+ critérios de aceitação e a matriz de rastreabilidade...
- O contrato completo dos endpoints, com corpos, status codes e regras de erro, está na Especificação da API.
- Com o que fazer definido, o resto desta página trata do com o quê: a stack escolhida, o desenho das telas, o modelo de dados e a ordem das treze etapas.

---

## Requisitos Não-Funcionais (RNF): Tabela

- RNF01: Validação Estrita de Dados | Todas as entradas de dados via HTTP (`body`, `query`, `params`) devem ser validadas no servidor com schemas Zod...
- RNF02: Criptografia & Segurança | Senhas nunca devem ser gravadas em texto limpo; o armazenamento deve utilizar hash Argon2id com salt por registro, e...
- RNF03: Persistência Relacional | Os dados devem ser armazenados em banco relacional (SQLite) com Prisma ORM, incluindo uma relação muitos-para-muitos...
- RNF04: Segurança na Chamada de Sistema | A execução do comando `ping` deve receber o endereço como argumento isolado, sem passar por shell, impedindo...
- RNF05: Origens Separadas | O front-end deve ter build próprio e ser publicado independentemente da API, com CORS no servidor e proxy no ambiente de...
- RNF06: Manutenibilidade & Tipagem | O código do servidor deve ser tipado estaticamente e organizado em camadas (rotas, controllers, models), com...

---

## Stack tecnológica da aplicação

- O projeto evolui adicionando bibliotecas e ferramentas de mercado conforme a necessidade do sistema:
- Cada etapa do MonitorApp aplica os conceitos explicados em detalhes nas aulas teóricas de Express.js:
- Rotas e Middlewares: veja Rotas no Express e Middlewares
- TypeScript e MVC: veja TypeScript no Express e Arquitetura MVC
- Validação e Erros: veja Validação de Requisições e Tratamento de Erros

---

## Stack tecnológica da aplicação: Tabela

- Front-end: HTML5 semântico, Tailwind CSS (Play CDN na etapa 1, compilado pelo Vite a partir da 2), JavaScript vanilla (`fetch`, DOM API)
- Back-end & Runtime: Node.js 24, Express 5 e TypeScript (da etapa 3 em diante)
- Validação & Erros: Schemas declarativos com Zod e middleware de erros customizado (`HttpError`)
- Persistência: SQLite nativo (`node:sqlite`) e, depois, Prisma ORM (schema declarativo, migrations e relação N-N)
- Coleta: `node:child_process` executando o `ping` do sistema, com agendador em `setInterval`
- Segurança & Auth: Hash Argon2id e JWT HS256, ambos com `node:crypto`, e middleware de autorização

---

## Arquitetura do sistema

- O MonitorApp separa front-end e API em duas origens desde a primeira etapa.
- O front é um projeto Vite com build próprio; a API é um servidor Express em TypeScript.
- Em desenvolvimento, o proxy do Vite faz o navegador enxergar uma origem só; em produção, o Nginx da imagem do front assume esse papel e o middleware...
- O InvestApp serve o front por `express.static` e por isso nunca precisa de CORS.
- O MonitorApp separa os dois desde o início: são dois `package.json`, dois servidores em desenvolvimento e duas imagens Docker.

---

## Protótipo visual e telas principais

- Conheça as telas do MonitorApp renderizadas a partir dos arquivos do projeto local em `examples/courses/express/projects/monitor-app-static/front/`:
- Painel principal com métricas da rede, cartões de host com estado e latência, e formulário para cadastrar um novo endereço:
- Detalhe de um host: última latência, média, disponibilidade, gráfico da série e tabela de medições:
- Interface de autenticação com e-mail e senha:
- Formulário de cadastro integrado ao hash de senha no servidor:

---

## Modelo de domínio e dicionário de dados

- Todas as etapas giram em torno das mesmas entidades, que vão sendo introduzidas aos poucos: o `Host` nasce na etapa 2, `Ping` e `Tag` na etapa 7, e o...

---

## Dicionário de dados do domínio

- O dicionário formaliza a estrutura, os tipos, as regras de integridade e o propósito de cada campo mantido pela aplicação.
- #### 1. Entidade `User` (Conta)
- Representa a pessoa cadastrada na plataforma, dona de um conjunto de hosts monitorados e responsável pela autenticação no sistema.
- #### 2. Entidade `Host` (Endereço monitorado)
- Representa um endereço de rede acompanhado pela aplicação: um IP, uma máquina interna ou um site público.

---

## Trilha incremental de desenvolvimento

- Front estático: Quatro telas em HTML semântico e Tailwind CSS, já no projeto Vite, sem JavaScript.
- API em memória: Rotas REST Express sobre um array, com o front consumindo a API pelo proxy do Vite.
- TypeScript em camadas: Migração da API para TypeScript com divisão em rotas, controllers, models e manipuladores de erro.
- Validação: Validação estrita de entradas HTTP (`body`, `query`, `params`) com schemas Zod, incluindo a regra de endereço.
- Documentação da API: Documento OpenAPI gerado dos próprios schemas Zod e servido com Swagger UI.

---

## Matriz comparativa das treze etapas

- Matriz comparativa das treze etapas aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Matriz comparativa das treze etapas: Tabela

- 1: `monitor-app-static` | estática | HTML + CSS | UX/UI em Tailwind CSS no Vite, sem JavaScript
- 2: `monitor-app-api` | array | JavaScript + front vanilla | rotas, JSON, proxy do Vite e CORS
- 3: `monitor-app-typescript` | array | TypeScript + front vanilla | camadas, `HttpError`, tipos do domínio
- 4: `monitor-app-validation` | array | TypeScript + front vanilla | schemas Zod para body, query e params
- 5: `monitor-app-swagger` | array | TypeScript + front vanilla | OpenAPI gerado dos schemas e Swagger UI
- 6: `monitor-app-db-simple` | `node:sqlite` | TypeScript + front vanilla | migration, seeders e model com SQL

---

## Navegação pelas etapas do MonitorApp

- Quatro telas em HTML e Tailwind CSS, já no projeto Vite, sem uma linha de JavaScript.
- Rotas, JSON e um array. O front vanilla passa a consumir a API pelo proxy do Vite.
- Migração para TypeScript, controllers, routers, erros e `HttpError`.
- Schemas Zod para corpo, query e params: incluindo a regra de endereço IP ou domínio.
- O mesmo schema que valida passa a documentar: OpenAPI gerado do Zod, servido no Swagger UI.

---

## Documentos de especificação

- Épicos, features, histórias de usuário, critérios de aceitação em Gherkin e tasks de cada etapa.
- O contrato completo: recursos, endpoints, corpos, status codes, erros e o formato dos eventos.
- Dívidas técnicas conhecidas, features do backlog, evoluções de arquitetura e desafios graduados.

---

## Evolução incremental do projeto

- Cada pasta de etapa nasce como cópia da anterior mais o delta daquela etapa.
- Nada que foi introduzido desaparece depois: o TypeScript da etapa 3 vale até a 13, a validação da etapa 4 continua nas rotas de todas as seguintes, e o...
- As remoções do trilho são substituições explicadas na própria página: o array em memória sai na etapa 6, quando o banco entra; os scripts de migration...
- Nos três casos o que entra faz o mesmo trabalho, melhor.
- Cada etapa resolve exatamente um problema novo e mantém tudo que veio antes.

---

## Evolução incremental do projeto: Exemplo 1

```bash
  git diff --no-index -- \
    examples/courses/express/projects/monitor-app-static \
    examples/courses/express/projects/monitor-app-api || true
```

---

## Evolução incremental do projeto: Exemplo 2

```bash
  git diff --no-index -- \
    examples/courses/express/projects/monitor-app-db-simple \
    examples/courses/express/projects/monitor-app-prisma || true
```

---

## Execução dos projetos locais

- Cada página de etapa aponta para uma pasta em `examples/courses/express/projects/`.
- Como front e API são projetos separados, cada um tem o seu `npm install` e o seu terminal:
- A etapa 7 em diante instala o Prisma; a etapa 3 acrescenta `typescript` e `@types/*`; a etapa 12 acrescenta `supertest`, `vitest` e o Playwright.
- Rode `npm install` de novo sempre que trocar de pasta: o `package.json` é diferente.

---

## Execução dos projetos locais: Exemplo

```bash
cd examples/courses/express/projects/monitor-app-prisma/back
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Iniciar a primeira etapa

- MonitorApp: Front estático: HTML, `tailwind.css` e as quatro telas do sistema, sem JavaScript.

---

## Depois da última etapa

- Próximos passos: as dívidas técnicas que o projeto conhece, as features que ficaram no backlog e cinco desafios graduados para continuar de onde a...

---

## Projeto irmão

- InvestApp: a mesma trilha, com front na mesma origem servido por `express.static`, e um domínio financeiro no lugar do domínio de rede.

---

## Resumo da Aula

- **Projeto: MonitorApp** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
