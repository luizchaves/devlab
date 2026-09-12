---
name: task-kanban-sync
description: >-
  Sincroniza tasks, bugs e PRs de projetos praticos com GitHub Projects/Kanban,
  movendo cards entre TODO, DOING, REVIEW e DONE quando autorizado.
---

# Task Kanban Sync

Use esta skill quando o usuario pedir para criar, atualizar ou mover cards em GitHub Projects/Kanban, ou quando outra skill precisar refletir o estado de uma task, bug ou PR no quadro.

## Estados Padrao

- `TODO`: task planejada, spec criada ou bug registrado, mas sem responsavel trabalhando.
- `DOING`: task atribuida a uma pessoa ou bug em investigacao/correcao ativa.
- `REVIEW`: Pull Request aberto ou correcao pronta para revisao.
- `DONE`: PR aprovado, mergeado e validado, ou bug resolvido sem PR quando esse for o fluxo aceito.

## Ferramentas

Prefira GitHub CLI (`gh`) quando estiver disponivel e autenticado. Comandos uteis incluem `gh auth status`, `gh repo view`, `gh issue create`, `gh issue edit`, `gh pr view`, `gh project list`, `gh project item-create`, `gh project item-list`, `gh project field-list` e `gh project item-edit`.

GitHub Projects usa IDs para projeto, campos e opcoes de status. Nunca invente esses IDs. Se eles nao puderem ser descobertos com `gh project ...`, pare e entregue o checklist manual com os dados necessarios.

## Fluxo

1. Identifique o item: task do `docs/PRD.md`, spec, issue, bug ou PR.
2. Descubra o repositorio e o Project correto. Se houver mais de um projeto possivel, pergunte antes de mover cards.
3. Confira se ja existe issue/card para evitar duplicacao.
4. Crie ou atualize o item com titulo, descricao, links para PRD/spec/PR, labels e responsavel quando informado.
5. Ajuste o status conforme o estado do fluxo: TODO, DOING, REVIEW ou DONE.
6. Relate o link do item/card, status final e qualquer campo que nao foi possivel alterar.

## Gatilhos Recomendados

- `task-spec-generator`: ao criar a spec, sugerir ou criar card em TODO.
- Atribuicao a uma pessoa: mover card para DOING e registrar assignee.
- `task-bug-fixer`: bug reproduzido entra em TODO ou DOING; bug com PR aberto vai para REVIEW; bug mergeado vai para DONE.
- `task-pr-finalizer`: PR aberto move para REVIEW; PR aprovado e mergeado move para DONE.
- `task-code-review`: review com bloqueadores mantem REVIEW; review aprovado prepara DONE apos merge.

## Autorizacao

Criar ou mover card remoto altera estado compartilhado. Execute somente quando o usuario pedir explicitamente ou quando a skill chamadora ja tiver recebido autorizacao para sincronizar o Kanban. Sem autorizacao, apenas sugira a mudanca e mostre os comandos ou passos manuais.
