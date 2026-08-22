---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "Especificação do Projeto da Disciplina"
description: "Slides da especificação do projeto final da disciplina de Desenvolvimento Web."
---

<!-- _class: lead -->

# Especificação do Projeto da Disciplina

Desenvolvimento Web — Curso Superior de Tecnologia em Redes de Computadores (CSTRC-JP)

---

## Visão Geral do Projeto

O projeto final é uma atividade **obrigatória** desenvolvida em etapas ao longo do semestre.

### Objetivos Principais

- Aplicar de forma prática os conceitos de desenvolvimento Web full-stack.
- Desenvolver um sistema Web aplicado à área de **Redes de Computadores**.
- Trabalhar de forma colaborativa com controle de versão e práticas modernas de Engenharia de Software.

---

## Estrutura das Etapas

```text
1. Concepção & Proposta
   └── Equipe, Tema em Redes, Telas Estáticas, Cadastro ifpb/projects e Pitch (5 min)

2. Projeto 1.1 — Front-end (100 pts)
   └── Interface Dinâmica, DOM, Fetch API, json-server e Modules (ESM)

3. Projeto 1.2 — Back-end & Full-stack (100 pts)
   └── Servidor Express.js, Banco de Dados (Prisma), JWT e Aplicação Integrada
```

---

## 1. Concepção & Definição do Tema

* **Equipe:** no máximo **3 integrantes**.
* **Tema:** Livre, com foco em automação de tarefas ou gerenciamento em **Redes de Computadores**.
* **Exemplos de Domínio:**
  * Monitoramento de métricas (CPU, Memória, Disco, Tráfego);
  * Gerenciamento de serviços (DNS, DHCP, Firewall, Samba, NFS);
  * Análise e consolidação de arquivos de log;
  * Agendamentos de tarefas (`cron`) ou IoT/Roteamento.

---

## Benchmarking & Identidade

* **Benchmarking:** Pesquisar ferramentas de mercado existentes (ex: *Grafana*, *Prometheus*, *Zabbix*, *Webmin*, *Nagios*).
* **Identidade do Projeto:** Definição de um nome/codinome marcante (ex: `netmonitor`) e criação de uma logo.
* **Repositório no GitHub:**
  * Nome do repositório em letras minúsculas (ex: `github.com/usuario/netmonitor`);
  * Configurar a seção **About** com descrição, homepage e tópicos obrigatoriamente incluindo `ifpb` e `ifpb-cstrc-jp-dw`.

---

## Telas Estáticas & Estrutura Inicial

* **Interface Estática:** Desenvolver telas em HTML5 e CSS puro ou frameworks (Tailwind, Bootstrap).
* **Página de Índice (`index.html`):** Criar um menu inicial mapeando e linkando todas as telas `.html` criadas.
* **Dados Fictícios:** Utilizar *mock data* (não é necessário ter código funcional ou API nesta fase).
* **Estrutura de Pastas Recomendada:**
  * `prototypes/`: artes, esboços e prints de tela;
  * `docs/`: detalhamento de requisitos e *features*.

---

## Cadastro no `ifpb/projects` via PR

A apresentação da proposta é feita enviando um **Pull Request** para o repositório [ifpb/projects](https://github.com/ifpb/projects):

1. **Fork & Clone:** Criar cópia pessoal do `ifpb/projects`.
2. **Cadastro dos Alunos:** Arquivo `src/content/people/nome-sobrenome-matricula.yml` para **cada estudante** (com foto no GitHub e perfil do LinkedIn).
3. **Cadastro do Projeto:** Um arquivo `src/content/projects/titulo-do-projeto.yml` por equipe.
4. **Endereços (`addresses`):** `repository` (mínimo), `homepage` (GitHub Pages) e `preview` (imagem 16:9 leve, `<500KB`, armazenada no próprio repo).

---

## Estrutura do Pitch (5 Minutos)

Apresentação oral em sala com duração de **5 minutos**:

* **Participação:** Todos os membros da equipe devem falar.
* **Treinamento:** Ensaie previamente para respeitar o tempo estipulado.
* **Roteiro da Apresentação:**
  1. Ideia e Objetivo Principal do Sistema
  2. Lista das Principais Funcionalidades (*Features*)
  3. Benchmarking de Sistemas de Mercado
  4. Esboço da Interface e Navegação entre Telas

---

## Projeto 1.1 — Front-end (Parte 1)

Avaliação da interface cliente consumindo API simulada (`json-server`):

| Critério | Foco da Avaliação | Pontuação |
| :--- | :--- | :---: |
| **Estruturação e Estilização** | Layout semântico, visual e uso de CSS/frameworks. | **20 pts** |
| **Estrutura de Dados** | Organização do arquivo `db.json` e recursos REST. | **20 pts** |
| **Consumo de API com Fetch** | Requisições HTTP (GET, POST, PUT/PATCH, DELETE) e erros. | **15 pts** |

---

## Projeto 1.1 — Front-end (Parte 2)

Avaliação da interface cliente consumindo API simulada (`json-server`):

| Critério | Foco da Avaliação | Pontuação |
| :--- | :--- | :---: |
| **Manipulação do DOM** | Criação manual de elementos (`createElement`, `appendChild`). | **15 pts** |
| **Tratamento de Eventos** | Captura de formulários, cliques e interações. | **15 pts** |
| **Uso de ESM** | Modularização do código com `import` e `export`. | **15 pts** |

---

## Projeto 1.2 — Back-end (Parte 1)

Avaliação do servidor e aplicação Full-Stack integrada:

| Critério | Foco da Avaliação | Pontuação |
| :--- | :--- | :---: |
| **Back-end com Express.js** | Arquitetura em camadas, validações e tratamento de erros. | **20 pts** |
| **Integração Front/Back** | Comunicação com API, gestão de sessão e erros de rede. | **20 pts** |
| **Banco de Dados & ORM** | Schema, relacionamentos, migrations e CRUD (Prisma). | **20 pts** |

---

## Projeto 1.2 — Back-end (Parte 2)

Avaliação do servidor e aplicação Full-Stack integrada:

| Critério | Foco da Avaliação | Pontuação |
| :--- | :--- | :---: |
| **Autenticação & JWT** | Login, cadastro, hashing de senhas e rotas protegidas. | **20 pts** |
| **Integração com Sistema/Config** | Variáveis de ambiente (`.env`) e proteção de segredos. | **20 pts** |

---

## Diferenciais de Maturidade Técnica

Aspectos qualitativos para enriquecer a aplicação:

* 🐳 **Docker:** `Dockerfile` e `docker-compose.yml` para execução unificada.
* 📖 **Documentação de API:** Swagger / OpenAPI.
* 🧪 **Testes Automatizados:** Testes unitários e de integração.
* 🐙 **Gestão no GitHub:** Commits descritivos, Issues, PRs e Kanban no **GitHub Projects**.
* 📐 **Artefatos de Engenharia:** `PRD.md`, `AGENTS.md` e pasta `specs/`.

---

## Autoavaliação Assistida por IA

Antes das entregas, utilize prompts de auditoria no Gemini / Claude / ChatGPT:

1. **Etapa Inicial:** Audite o Pitch, README, metadados YAML e telas estáticas.
2. **Projeto 1.1:** Avalie os 6 critérios de Front-end fornecendo o código JS, HTML e `db.json`.
3. **Projeto 1.2:** Audite a arquitetura Express.js, schema Prisma, autenticação JWT e segurança.

---

<!-- _class: lead -->

# Bom Trabalho no Projeto!

Consulte as especificações detalhadas e bons estudos!
