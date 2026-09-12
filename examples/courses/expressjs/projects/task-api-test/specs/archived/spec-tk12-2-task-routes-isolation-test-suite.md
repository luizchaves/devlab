# Spec TK12.2: Suíte de Testes de Rotas de Tarefas e Isolamento de Dono

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.2
- **Branch**: feat/tk12-2-task-tests
- **História de Usuário**: US20 (Alterar sem quebrar o existente)
- **Requisitos Atendidos**: RNF08

## 1. Contexto e Objetivos

Criar src/routes/task-router.test.ts validando isolamento entre contas, 404 em acesso cruzado e validação Zod.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/task-router.test.ts` | Criar | Testes de rotas de tarefas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Testes de Tarefas**:
   - Testar isolamento de contas e regras de negócio de tarefas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA20.3 - Teste Automatizado de Isolamento
  Dado dois usuários cadastrados na suíte de testes
  Quando um usuário tenta acessar recursos do outro
  Então as asserções devem comprovar resposta 404
```

## 5. Plano de Verificação

- **Testes de Isolamento**: Executar pnpm test.
