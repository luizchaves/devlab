---
name: task-code-review
description: >-
  Revisa branches, diffs ou Pull Requests de um projeto pratico, analisando mudancas,
  testes, CI, hooks, riscos e necessidade de atualizar AGENTS.md ou skills locais.
---

# Task Code Review

Use esta skill quando o usuario pedir review de codigo, analise de PR, auditoria de branch ou avaliacao antes de merge em um projeto pratico dos guias.

## Objetivo

Produzir uma revisao operacional baseada no estado real do projeto: bugs, regressos, riscos de arquitetura, lacunas de teste, comandos quebrados, inconsistencias com `AGENTS.md` e necessidade de ajustar skills locais em `.agents/skills/`.

## Fluxo

1. Identifique a base do review: PR remoto, branch local, patch ou diff contra `main`.
2. Leia `AGENTS.md`, `docs/PRD.md`, `README.md`, `package.json`, specs relacionadas e os arquivos alterados.
3. Verifique automacoes do proprio projeto:
   - `.github/workflows/` para CI;
   - `.husky/`, hooks versionados, `pre-commit`, `pre-push`, `lint-staged` ou script `prepare` no `package.json`;
   - diferenca entre o que o CI roda e o que o `AGENTS.md` exige.
4. Revise o diff e o estado final procurando impactos praticos:
   - comportamento quebrado, falha de validacao ou regressao de API/UI;
   - violacao das regras inviolaveis do projeto;
   - dependencia nova sem necessidade clara;
   - teste ausente para regra de negocio, policy, endpoint, migracao ou fluxo de tela;
   - documentacao, spec ou skill que ficou desatualizada.
5. Rode validacao proporcional. Prefira os scripts do projeto: `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e` ou equivalentes existentes.
6. Se o review pedir aceite do PR, so recomende merge quando nao houver bloqueadores e a validacao relevante estiver verde.

## Saida

Comece pelos achados, ordenados por severidade, com arquivo e linha quando possivel. Depois informe perguntas abertas, comandos executados e risco residual. Se nao houver achados, diga isso claramente e registre o que foi validado.

## AGENTS.md E Skills

Aponte necessidade de alterar `AGENTS.md` ou `.agents/skills/` somente quando a mudanca atual torna uma instrucao falsa, incompleta ou perigosa, ou quando cria um fluxo recorrente que agentes futuros precisam seguir.
