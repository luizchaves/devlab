---
name: task-pr-finalizer
description: >-
  Finaliza uma task tecnica, valida qualidade, arquiva specs, cria commit atomico,
  abre Pull Request e, quando autorizado, aceita o PR com merge na main e limpeza de branch.
---

# Task PR Finalizer

Use esta skill para concluir uma task de projeto pratico depois da implementacao: validar, arquivar spec, criar commit, enviar branch, abrir Pull Request e, se o usuario pedir, finalizar o PR aprovado com merge na `main`.

## Finalizacao Da Task

1. Confirme a branch atual e a task relacionada no `docs/PRD.md`.
2. Localize a spec em `specs/active/`, quando o projeto usar specs.
3. Rode a validacao definida pelo projeto em `AGENTS.md` e pelos scripts do `package.json`. Exemplos comuns: `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm test` e `pnpm test:e2e`.
4. Verifique automacoes locais e remotas: `.github/workflows/`, `.husky/`, `pre-commit`, `pre-push`, `lint-staged` e script `prepare`.
5. Atualize a spec para concluida e mova de `specs/active/` para `specs/archived/` quando aplicavel.
6. Crie commit atomico com Conventional Commits em ingles e tag da task, por exemplo `feat: [TK01.2] add task validation`.
7. Faca push da branch e crie o Pull Request com resumo, validacao, riscos e criterios atendidos.

## Descricao Do PR

A descricao deve ser factual e revisavel:

- resumo da mudanca;
- task, historia de usuario, requisitos e spec relacionados;
- principais arquivos ou areas alteradas;
- comandos de validacao executados;
- riscos, migracoes, dependencias novas ou pontos de atencao;
- evidencias manuais quando houver UI, API ou banco.

Nao declare teste, build ou validacao que nao foi executada.

## Aceitar PR, Mergear Na Main E Finalizar Branch

Quando o usuario pedir para aceitar o PR ou finalizar a branch apos aprovacao:

1. Confirme que nao ha achados bloqueadores no review.
2. Confirme que o CI remoto passou ou rode validacao local equivalente quando nao houver CI.
3. Verifique `git status` e preserve mudancas locais nao relacionadas.
4. Atualize a `main` local a partir do remoto.
5. Realize o merge conforme o pedido do usuario ou a politica do projeto: merge commit, squash ou fast-forward.
6. Rode uma validacao final na `main` quando o risco justificar.
7. Faca push da `main` somente quando autorizado.
8. Remova branch local ou remota somente quando o usuario pedir ou quando essa limpeza estiver claramente incluida na solicitacao.
9. Relate commit final, comandos executados, estado de `git status` e situacao da branch.

Nunca use `git reset --hard`, force push ou exclusao de branch remota sem pedido explicito.
## Sincronizacao Com Kanban

Quando o PR for criado, acione ou recomende `task-kanban-sync` para mover o item para `REVIEW` e vincular o Pull Request. Quando o review for concluido, o PR for mergeado na `main` e a validacao final passar, mova o item para `DONE` se o usuario autorizou sincronizacao remota.
