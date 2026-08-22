---
title: 'Especificação do Projeto da Disciplina'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Especificação do Projeto da Disciplina

## Objetivos e Formação

- **Propósito:** Aplicação prática de desenvolvimento Web Full-Stack
- **Domínio:** Sistemas Web aplicados a Redes de Computadores
- **Formação:** Equipes de no máximo 3 integrantes

## Etapa 1: Concepção, Proposta e Pitch

### Definição do Tema e Benchmarking

- Tema livre na área de Redes
  - Monitoramento (CPU, RAM, Disco, Tráfego)
  - Serviços (DNS, DHCP, Firewall, Samba, NFS)
  - Análise de Logs
  - Agendamentos (`cron`) e IoT
- Benchmarking
  - Análise de ferramentas de mercado (Grafana, Zabbix, Webmin)
  - Inspiração em projetos anteriores (`dw-cstrc-jp`)

### Identidade e Repositório

- Nome e codinome em minúsculas (ex: `netmonitor`)
- Repositório no GitHub
  - Configuração do **About** (Description, Website, Topics)
  - Tópicos obrigatórios: `ifpb` e `ifpb-cstrc-jp-dw`
  - Telas estáticas em HTML/CSS com dados fictícios
  - Página de índice (`index.html`) mapeando todas as telas
  - Estrutura de pastas: `prototypes/` e `docs/`

### Cadastro no `ifpb/projects`

- Pull Request (PR) enviado a partir do fork do estudante
- Arquivo individual de pessoa: `src/content/people/nome-sobrenome-id.yml`
  - GitHub, LinkedIn e foto de perfil (`avatar.github` / `githubUC`)
- Arquivo de projeto: `src/content/projects/titulo-do-projeto.yml`
  - `repository`, `homepage` (GitHub Pages) e `preview` (imagem 16:9 `<500KB` no próprio repo)
- Cuidado: **não enviar o código-fonte** da aplicação no PR para `ifpb/projects`

### Apresentação do Pitch (5 Minutos)

- Todos os integrantes da equipe participam da fala
- Treinamento prévio para respeitar o tempo de 5 minutos
- Roteiro do Pitch:
  1. Problema e Objetivo
  2. Lista de Funcionalidades (*Features*)
  3. Benchmarking de mercado
  4. Telas estáticas e fluxo de navegação

## Etapa 2: Projeto 1.1 — Front-end (100 pts)

- Estruturação e Estilização das Páginas (20 pts)
- Estruturação de Dados com `json-server` (`db.json`) (20 pts)
- Consumo de API com `fetch` (GET, POST, PUT/PATCH, DELETE) (15 pts)
- Manipulação do DOM e Componentes Dinâmicos (`createElement`) (15 pts)
- Tratamento de Eventos de Usuário (15 pts)
- Modularização com ESM (`import`/`export`) (15 pts)
- Gestão no GitHub Projects (Kanban e commits individuais)

## Etapa 3: Projeto 1.2 — Back-end (100 pts)

- Back-end com Express.js (rotas, controllers, models, middlewares, erros) (20 pts)
- Integração Front-end e Back-end (20 pts)
- Banco de Dados e ORM (schema Prisma, migrations, CRUD) (20 pts)
- Autenticação e Controle de Acesso (login, bcrypt, JWT) (20 pts)
- Integração com Sistema e Configuração (`.env`, segredos) (20 pts)

## Diferenciais de Maturidade Técnica

- Docker (`Dockerfile` e `docker-compose.yml`)
- Documentação da API (Swagger / OpenAPI)
- Testes Automatizados (unitários e integração)
- Gestão de Projeto no GitHub (Issues, PRs, Projects)
- Artefatos de Engenharia (`PRD.md`, `AGENTS.md`, pasta `specs/`)

## Autoavaliação Assistida por IA

- Auditoria de Proposta Inicial e Pitch (5 min)
- Auditoria do Projeto 1.1 (Front-end e `json-server`)
- Auditoria do Projeto 1.2 (Back-end Express e Prisma)
