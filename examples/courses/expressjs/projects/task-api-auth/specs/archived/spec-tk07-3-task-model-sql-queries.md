# Spec TK07.3: Reescrita do Model de Tarefas com SQL Parametrizado

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.3
- **Branch**: feat/tk07-3-model-sql
- **História de Usuário**: US09 (Não perder tarefas ao reiniciar)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Reescrever src/models/task-model.ts substituindo array em memória por consultas SQL parametrizadas com whitelist no ORDER BY.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/task-model.ts` | Modificar | Consultas SQL no model de tarefas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model SQL**:
   - Converter operações para SQL parametrizado e mapear booleanos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.2 - Persistência após Reinicialização
  Dado que uma tarefa é criada via API
  Quando o servidor é reiniciado
  Então a tarefa criada deve permanecer disponível na consulta
```

## 5. Plano de Verificação

- **Teste de Persistência**: Criar registro, reiniciar processo e consultar.
