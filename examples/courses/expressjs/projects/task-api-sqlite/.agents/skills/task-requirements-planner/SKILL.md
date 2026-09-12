---
name: task-requirements-planner
description: >-
  Ajuda a levantar requisitos, atualizar PRD, sugerir epicos, features, user stories,
  criterios de aceite, tasks tecnicas e impacto na sprint de projetos praticos.
---

# Task Requirements Planner

Use esta skill quando o usuario pedir para transformar uma ideia, bug recorrente, feedback, necessidade de produto ou mudanca tecnica em requisitos do projeto pratico.

## Objetivo

Atualizar ou propor alteracoes para `docs/PRD.md` com rastreabilidade suficiente para orientar specs, Kanban, sprint e implementacao.

## Fluxo

1. Leia `AGENTS.md`, `README.md`, `docs/PRD.md`, backlog, specs ativas/arquivadas e contexto de produto afetado.
2. Classifique a demanda: feature, bug, melhoria tecnica, requisito nao funcional, debito tecnico, experimento ou ajuste de sprint.
3. Identifique lacunas: objetivo de usuario, regras de negocio, restricoes, criterios de aceite, riscos, dependencias, metricas e casos fora de escopo.
4. Sugira atualizacoes no PRD em formato consistente com o projeto: epico, feature, US, RF/RNF, CA em Gherkin e tasks tecnicas `TK`.
5. Sugira impacto na sprint: prioridade, tamanho relativo, dependencias, responsavel quando informado e qual coluna Kanban inicial deve receber o item.
6. Se autorizado, edite `docs/PRD.md` e documentos de sprint/backlog relacionados. Caso contrario, entregue o patch proposto em Markdown.
7. Quando criar tasks novas, recomende acionar `task-kanban-sync` para criar cards em TODO.

## Saida

Entregue uma proposta objetiva com:

- resumo da necessidade;
- mudancas sugeridas no PRD;
- user stories e criterios de aceite;
- tasks tecnicas propostas;
- impacto na sprint/Kanban;
- perguntas abertas e decisoes pendentes.

Nao invente prioridade, responsavel, prazo ou sprint quando o PRD/contexto nao trouxer evidencia. Marque como sugestao ou pergunta aberta.
