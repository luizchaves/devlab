---
name: task-bug-fixer
description: >-
  Investiga, reproduz, corrige e valida bugs em projetos praticos, atualizando testes,
  documentacao, AGENTS.md ou skills quando a causa exigir.
---

# Task Bug Fixer

Use esta skill quando o usuario pedir para investigar erro, teste quebrado, bug visual, falha de build, endpoint incorreto, regressao, problema de banco ou comportamento inesperado em um projeto pratico.

## Principio

Corrija a causa raiz com a menor mudanca coerente. O trabalho termina com reproducao, correcao, validacao e relato honesto do que foi provado.

Abrir Pull Request nao e automatico por padrao. Se o usuario pedir explicitamente para corrigir e abrir PR na mesma solicitacao, conclua a correcao e depois siga a skill `task-pr-finalizer` para commit, push e PR. Se o usuario pedir apenas para corrigir, pare com a correcao validada e indique que a finalizacao do PR deve usar `task-pr-finalizer`.

## Fluxo

1. Reproduza o problema com o menor comando, teste, request HTTP ou fluxo de tela possivel.
2. Leia o contexto necessario: `AGENTS.md`, `docs/PRD.md`, spec ativa/arquivada, arquivos envolvidos e scripts do `package.json`.
3. Formule uma hipotese verificavel antes de editar.
4. Corrija preservando arquitetura, idioma dos identificadores, regras de dependencia e separacao de camadas do projeto.
5. Adicione ou ajuste teste quando o bug representar regra de negocio, contrato de API, policy, migracao, fluxo de tela ou regressao plausivel.
6. Rode validacao focada e, quando o risco justificar, a suite completa do projeto.
7. Se o bug revelar falha no processo, atualize `AGENTS.md`, `docs/PRD.md`, specs ou skills locais junto da correcao.
8. Se o pedido original tambem exigir PR, acione o fluxo da `task-pr-finalizer`: confira status, commit atomico, push da branch e abertura de Pull Request com validacao e riscos.

## Saida

Relate causa raiz, arquivos alterados, validacao executada e risco residual. Se nao for possivel reproduzir, diga quais caminhos foram testados e qual evidencia ainda falta.

Quando um PR for aberto por pedido explicito, inclua tambem o link ou numero do PR, branch, commit e o estado do CI quando disponivel.
## Kanban Para Bugs

Quando o bug for confirmado, sugira ou use `task-kanban-sync` para criar/localizar o card:

- `TODO` para bug registrado mas ainda nao assumido;
- `DOING` quando a investigacao ou correcao estiver atribuida a alguem;
- `REVIEW` quando houver PR aberto para a correcao;
- `DONE` quando o PR for mergeado e validado, ou quando a correcao sem PR for aceita no fluxo do projeto.

Movimentar cards remotos exige autorizacao explicita. Sem autorizacao, registre a recomendacao na saida.
