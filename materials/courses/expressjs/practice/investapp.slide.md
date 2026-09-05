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
title: "Projeto: InvestApp"
description: "Aplicação de controle de investimentos construída em treze etapas: front estático, API em memória, TypeScript, validação, SQLite, Prisma, usuário, autenticação, e-mail, upload de avatar, testes e Docker."
---

<!-- _class: lead -->

# Projeto: InvestApp

Aplicação de controle de investimentos construída em treze etapas: front estático, API em memória, TypeScript, validação, SQLite, Prisma, usuário, autenticação, e-mail, upload de avatar, testes e Docker.

---

## Objetivo

- O InvestApp visa fornecer uma plataforma web intuitiva e segura para a gestão e acompanhamento de carteiras de investimentos pessoais.
- O sistema permite centralizar a visualização de ativos financeiros (renda fixa, ações, fundos, títulos públicos), facilitando o controle de valores...

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-test`
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

- Nível Iniciante → Avançado · HTML · Tailwind CSS · Node.js · Express.js · TypeScript · Prisma · Testes
- O InvestApp é a aplicação que atravessa o guia inteiro: um controle de investimentos com front-end web e API própria.
- Ele não é um projeto pronto: é a mesma aplicação em treze estados, com cada etapa isolando uma decisão técnica.

---

## Análise de requisitos

- Análise de requisitos aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de controle de investimentos construída em treze etapas: front estático, API em memória, TypeScript, validação, SQLite, Prisma, usuário,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Público-alvo

- O InvestApp foi projetado para atender a dois perfis principais de usuários:
- Estudantes e Desenvolvedores Web: Alunos de cursos de tecnologia e engenheiros de software que buscam aprender, de forma prática e incremental, a...
- Investidores Pessoais: Pessoas físicas que necessitam de uma ferramenta direta e privada para organizar e acompanhar o patrimônio investido (Renda...

---

## Requisitos Funcionais (RF)

- Requisitos Funcionais (RF) aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de controle de investimentos construída em treze etapas: front estático, API em memória, TypeScript, validação, SQLite, Prisma, usuário,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Requisitos Funcionais (RF): Tabela

- RF01: Gestão de Investimentos (CRUD) | O sistema deve permitir criar, listar, consultar por id, atualizar e remover investimentos com nome, valor,...
- RF02: Cadastro de Usuários | O sistema deve permitir o auto-cadastro de novos investidores informando nome, e-mail único e senha.
- RF03: Autenticação & Sessão | O sistema deve autenticar usuários via e-mail e senha, retornando um token de acesso JWT para manter a sessão ativa.
- RF04: Isolamento por Dono | O sistema deve garantir que o investidor autenticado acesse e manipule estritamente a sua própria carteira de ativos.
- RF05: Notificação de Boas-Vindas | O sistema deve enviar automaticamente um e-mail transacional de confirmação ao concluir o cadastro de um novo usuário.
- RF06: Gestão de Perfil & Upload de Avatar | O sistema deve permitir a atualização dos dados cadastrais e o envio de foto de perfil (imagem no formato...

---

## Requisitos Não-Funcionais (RNF)

- A decomposição completa dos requisitos em 5 épicos, 14 features, 15 histórias de usuário, 80+ critérios de aceitação e a matriz de rastreabilidade está...
- O contrato completo dos endpoints, com corpos, status codes e regras de erro, está na Especificação da API.
- Com o que fazer definido, o resto desta página trata do com o quê: a stack escolhida, o desenho das telas, o modelo de dados e a ordem das treze etapas.

---

## Requisitos Não-Funcionais (RNF): Tabela

- RNF01: Validação Estrita de Dados | Todas as entradas de dados via HTTP (`body`, `query`, `params`) devem ser validadas no servidor com schemas Zod...
- RNF02: Criptografia & Segurança | Senhas de usuários nunca devem ser gravadas em texto limpo; o armazenamento deve utilizar hash Argon2id com salt por...
- RNF03: Persistência Relacional | Os dados da aplicação devem ser armazenados em banco de dados relacional (SQLite) utilizando o Prisma ORM para...
- RNF04: Qualidade & Testabilidade | A aplicação deve possuir suítes de testes automatizados cobrindo lógica unitária, integração de rotas API...
- RNF05: Portabilidade & Conteinerização | A aplicação inteira (Node.js API + banco SQLite + assets) deve ser empacotável em imagem Docker multi-estágio...
- RNF06: Manutenibilidade & Tipagem | O código do servidor deve ser tipado estaticamente e organizado em camadas (rotas, controllers, models), com...

---

## Stack tecnológica da aplicação

- O projeto evolui adicionando bibliotecas e ferramentas de mercado conforme a necessidade do sistema:
- Cada etapa do InvestApp aplica os conceitos explicados em detalhes nas aulas teóricas de Express.js:
- Rotas e Arquivos Estáticos: veja Rotas no Express
- TypeScript e MVC: veja TypeScript no Express e Arquitetura MVC
- Validação e Erros: veja Validação de Requisições e Tratamento de Erros

---

## Stack tecnológica da aplicação: Tabela

- Front-end: HTML5 semântico, Tailwind CSS utility-first (Play CDN no protótipo da etapa 1, compilado pela CLI da etapa 2 em diante), JavaScript vanilla...
- Back-end & Runtime: Node.js 24, Express 5 e TypeScript (da etapa 3 em diante)
- Validação & Erros: Schemas declarativos com Zod e middleware de erros customizado (`HttpError`)
- Persistência: SQLite nativo (`node:sqlite`) e, depois, Prisma ORM (schema declarativo e migrations)
- Segurança & Auth: Hash Argon2id e JWT HS256, ambos com `node:crypto`, e middleware de autorização
- Serviços & Upload: Envio de e-mail transacional (Nodemailer) e upload multipart/form-data (Multer)

---

## Arquitetura do sistema

- O InvestApp segue uma arquitetura em camadas (MVC descentralizado), onde o front-end web comunica-se com a API RESTful em TypeScript via HTTP/JSON.
- A autenticação é stateless baseada em JWT, a validação de entrada é garantida por schemas declarativos Zod, e a persistência relacional é gerida pelo...
- As três camadas explicam por que o InvestApp não precisa de CORS: o `express.static` da camada 2 entrega as próprias páginas da camada 1, então o...
- É a diferença central em relação ao MonitorApp, que separa front e API em dois processos desde a primeira etapa.
- A seta que vai de `controllers/` para `config/ e services/` é a única que sai do caminho requisição → banco: upload e e-mail são efeitos colaterais, e...

---

## Protótipo visual e telas principais

- Conheça as telas do InvestApp renderizadas a partir dos arquivos do projeto local em `examples/courses/expressjs/projects/invest-app-static/`:
- Painel principal com métricas da carteira, cartões de ativos e formulário para registrar novos investimentos:
- Interface de autenticação do investidor com validação visual de e-mail e senha:
- Formulário de cadastro de novo usuário integrado ao hash de senha no servidor:
- Gestão de conta do usuário com foto de perfil e suporte a upload de avatar:

---

## Modelo de domínio e dicionário de dados

- Todas as etapas giram em torno das mesmas entidades do modelo de dados relacional, que vão sendo introduzidas e integradas aos poucos ao longo do projeto:

---

## Dicionário de dados do domínio

- O dicionário de dados formaliza a estrutura, tipos, regras de integridade e propósitos de cada campo mantido pela aplicação:
- #### 1. Entidade `User` (Investidor / Conta)
- Representa o investidor cadastrado na plataforma, dono da carteira de investimentos e responsável pela autenticação no sistema.
- #### 2. Entidade `Investment` (Investimento / Ativo Financeiro)
- Representa um ativo financeiro ou título custodiado pertencente à carteira de um usuário.

---

## Trilha incremental de desenvolvimento

- Front estático: As quatro telas em HTML semântico e Tailwind CSS, definindo a UX do sistema sem JavaScript. Elas são herdadas por todas as etapas...
- API em memória: Rotas REST Express alimentando o front-end via JavaScript vanilla (`fetch`).
- TypeScript em camadas: Migração da API para TypeScript com divisão em rotas, controllers e manipuladores de erro.
- Validação: Validação estrita de entradas HTTP (`body`, `query`, `params`) com schemas Zod.
- Documentação da API: Documento OpenAPI gerado dos próprios schemas Zod e servido com Swagger UI.

---

## Matriz comparativa das treze etapas

- Matriz comparativa das treze etapas aparece como ponto central da aula, não apenas como item de índice.
- Aplicação de controle de investimentos construída em treze etapas: front estático, API em memória, TypeScript, validação, SQLite, Prisma, usuário,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Matriz comparativa das treze etapas: Tabela

- 1: `invest-app-static` | estática | HTML + CSS | as quatro telas em Tailwind CSS, sem JavaScript
- 2: `invest-app-api` | array | JavaScript + front vanilla | rotas, JSON e front vanilla com `fetch`
- 3: `invest-app-typescript` | array | TypeScript + front vanilla | camadas, `HttpError`, tipos do domínio
- 4: `invest-app-validation` | array | TypeScript + front vanilla | schemas com Zod para body, query e params
- 5: `invest-app-swagger` | array | TypeScript + front vanilla | OpenAPI gerado dos schemas e Swagger UI
- 6: `invest-app-db-simple` | `node:sqlite` | TypeScript + front vanilla | migration, seeders e model com SQL

---

## Navegação pelas etapas do InvestApp

- Telas em HTML e Tailwind CSS, sem JavaScript, já com dashboard, conta e perfil.
- Rotas, JSON e um array. O front-end vanilla começa a consumir a API de verdade.
- Migração para TypeScript, controllers, routers, erros e `HttpError`.
- Schemas com Zod para corpo, query string e parâmetros de rota.
- O mesmo schema que valida passa a documentar: OpenAPI gerado do Zod, servido no Swagger UI.

---

## Documentos de especificação

- Épicos, features, histórias de usuário, critérios de aceitação em Gherkin e tasks de cada etapa.
- O contrato completo: recursos, endpoints, corpos, status codes, erros e o upload de avatar.
- Dívidas técnicas conhecidas, features do backlog, evoluções de arquitetura e desafios graduados.

---

## Evolução incremental do projeto

- Cada pasta de etapa nasce como cópia da anterior mais o delta daquela etapa.
- Nada que foi introduzido desaparece depois: o TypeScript da etapa 3 vale até a 12, a validação da etapa 4 continua nas rotas de todas as seguintes, e o...
- As duas únicas remoções do trilho são substituições explicadas na própria página: o array em memória sai na etapa 6, quando o banco entra, e os scripts...
- Cada etapa resolve exatamente um problema novo e mantém tudo que veio antes.
- O código de todo o projeto reside 100% no próprio repositório, dentro de `examples/courses/expressjs/projects/`.

---

## Evolução incremental do projeto: Exemplo 1

```bash
  git diff --no-index -- \
    examples/courses/expressjs/projects/invest-app-static \
    examples/courses/expressjs/projects/invest-app-api || true
```

---

## Evolução incremental do projeto: Exemplo 2

```bash
  git diff --no-index -- \
    examples/courses/expressjs/projects/invest-app-db-simple \
    examples/courses/expressjs/projects/invest-app-prismajs-relation || true
```

---

## Execução dos projetos locais

- Cada página de etapa aponta para uma pasta em `examples/courses/expressjs/projects/`. Localmente:
- A etapa 7 em diante instala o Prisma; a etapa 3 acrescenta `typescript` e `@types/*`.
- Rode `npm install` de novo sempre que trocar de pasta: o `package.json` é diferente.

---

## Execução dos projetos locais: Exemplo

```bash
cd examples/courses/expressjs/projects/invest-app-db-simple
npm install
npm run dev
```

---

## Iniciar a primeira etapa

- InvestApp: Front estático: HTML, `tailwind.css` e UX completa sem JavaScript.

---

## Depois da última etapa

- Próximos passos: as dívidas técnicas que o projeto conhece, as features que ficaram no backlog e cinco desafios graduados para continuar de onde a...

---

## Projeto irmão

- MonitorApp: a mesma trilha de treze etapas em outro domínio, com o front-end em build próprio e outra origem, relação muitos-para-muitos, chamada de...

---

## Resumo da Aula

- **Projeto: InvestApp** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
