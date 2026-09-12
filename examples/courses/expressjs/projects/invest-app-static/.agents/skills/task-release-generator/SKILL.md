---
name: task-release-generator
description: >-
  Prepara release SemVer de um projeto pratico com versao, CHANGELOG.md, validacao,
  commit e tag Git quando o projeto possuir ciclo proprio de release.
---

# Task Release Generator

Use esta skill quando o usuario pedir versao, release, tag ou changelog de um projeto pratico que tenha ciclo proprio de entrega.

## Antes De Comecar

Nem todo projeto pratico precisa de release propria. Se o projeto for apenas uma etapa didatica acumulativa sem publicacao independente, confirme se a release deve ser feita dentro do projeto ou no repositorio DevLab raiz.

## Fluxo

1. Verifique `git status` e preserve mudancas nao relacionadas.
2. Leia `package.json`, `README.md`, `docs/PRD.md`, `AGENTS.md` e tags existentes.
3. Defina a versao SemVer `X.Y.Z`. Se o usuario nao informou, proponha patch, minor ou major com base nos commits desde a ultima tag.
4. Rode a validacao relevante antes de alterar versao: `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e` ou scripts equivalentes existentes.
5. Atualize `package.json` quando houver campo `version`, `docs/PRD.md` quando houver tabela de versao, e `CHANGELOG.md` quando existir ou quando a release exigir criacao.
6. Gere changelog a partir de Conventional Commits e do diff real, agrupando por `Features`, `Bug Fixes`, `Documentation`, `Tests` e `Maintenance`.
7. Rode a validacao novamente.
8. Crie commit `chore(release): vX.Y.Z` e tag anotada `vX.Y.Z` somente quando autorizado.
9. Push de commit ou tag exige pedido explicito ou confirmacao clara do usuario.

## Saida

Informe versao gerada, intervalo de commits, arquivos alterados, validacao executada, tag criada e se houve ou nao publicacao remota.
