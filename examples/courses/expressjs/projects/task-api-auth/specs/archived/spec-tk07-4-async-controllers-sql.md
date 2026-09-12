# Spec TK07.4: Adequação dos Controllers para Operações Assíncronas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.4
- **Branch**: feat/tk07-4-async-controllers
- **História de Usuário**: US09 (Não perder tarefas ao reiniciar)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Atualizar src/controllers/task-controller.ts para utilizar await em todas as chamadas ao model assíncrono.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/controllers/task-controller.ts` | Modificar | Chamadas assíncronas no controller |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Controllers Assíncronos**:
   - Garantir await em list, getById, create, update e remove.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.6 - Preservação de Contrato com Banco
  Dado que o armazenamento foi migrado para SQLite
  Quando as rotas HTTP são requisitadas
  Então devem manter os mesmos contratos e respostas JSON
```

## 5. Plano de Verificação

- **Validação de Contrato**: Executar requests.http e conferir respostas.
