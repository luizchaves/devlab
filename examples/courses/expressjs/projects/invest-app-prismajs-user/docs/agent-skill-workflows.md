# Fluxos entre skills operacionais

Este documento resume os fluxos esperados entre as skills locais deste projeto pratico. Ele serve como mapa rapido para decidir qual skill acionar em cada momento do desenvolvimento.

```mermaid
flowchart TD
  idea[Ideia, feedback ou necessidade] --> requirements[task-requirements-planner]
  requirements --> prd[Atualiza ou propoe PRD, sprint e tasks TK]
  prd --> kanbanTodo[task-kanban-sync: card em TODO]
  prd --> spec[task-spec-generator]

  spec --> branch[Cria branch e spec em specs/active]
  spec --> kanbanTodo
  kanbanTodo --> assigned{Task atribuida?}
  assigned -- sim --> kanbanDoing[task-kanban-sync: card em DOING]
  assigned -- nao --> backlog[Permanece em TODO]

  kanbanDoing --> implementation[Implementacao]
  implementation --> bugCheck{Bug ou regressao?}
  bugCheck -- sim --> bugfix[task-bug-fixer]
  bugCheck -- nao --> finalize[task-pr-finalizer]

  bugfix --> reproduce[Reproduz, corrige e valida]
  reproduce --> bugPr{Usuario pediu PR?}
  bugPr -- sim --> finalize
  bugPr -- nao --> fixedOnly[Entrega correcao validada]
  bugfix --> kanbanBug[task-kanban-sync: TODO/DOING/REVIEW/DONE conforme estado do bug]

  finalize --> validation[Valida, arquiva spec, commita e envia branch]
  validation --> pr[Abre Pull Request]
  pr --> kanbanReview[task-kanban-sync: card em REVIEW]
  pr --> review[task-code-review]

  review --> blockers{Ha bloqueadores?}
  blockers -- sim --> implementation
  blockers -- nao --> merge[task-pr-finalizer: merge na main quando autorizado]
  merge --> done[task-kanban-sync: card em DONE]

  done --> releaseNeeded{Projeto tem release propria?}
  releaseNeeded -- sim --> release[task-release-generator]
  releaseNeeded -- nao --> finish[Fim do fluxo]
  release --> tag[Versao, CHANGELOG, commit e tag]
  tag --> finish
```

## Regra de autorizacao

Skills podem sugerir movimentacao de Kanban, criacao de card, push, PR, merge ou tag, mas qualquer alteracao remota compartilhada exige pedido claro do usuario ou confirmacao explicita no momento do fluxo.

## Estados do Kanban

| Estado | Quando usar |
| ------ | ----------- |
| `TODO` | Requisito/task/bug registrado, ainda sem execucao ativa. |
| `DOING` | Task atribuida ou bug em investigacao/correcao. |
| `REVIEW` | PR aberto ou correcao aguardando revisao. |
| `DONE` | PR mergeado e validado, ou correcao aceita no fluxo do projeto. |
