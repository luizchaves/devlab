# Spec TK09.7: Isolamento Estrito de Tarefas por Proprietário

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.7
- **Branch**: feat/tk09-7-owner-isolation
- **História de Usuário**: US13 (Ver apenas as minhas tarefas)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Escopar todas as consultas e mutações em task-model.ts e task-controller.ts pelo userId do token autenticado.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/task-model.ts` | Modificar | Escopo por userId nas queries |
| `src/controllers/task-controller.ts` | Modificar | Injeção do userId do token |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Isolamento de Posse**:
   - Garantir que cada usuário só acesse suas tarefas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA13.2 - Consulta Cruzada Responde 404
  Dado que o usuário A tenta consultar ou alterar a tarefa do usuário B
  Quando a requisição é processada
  Então deve responder 404 Not Found sem confirmar a existência do recurso
```

## 5. Plano de Verificação

- **Teste de Isolamento**: Tentar acesso cruzado entre dois usuários e validar 404.
