# Spec TK10.4: Escopo de Hosts e Histórico pelo Usuário Autenticado

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.4
- **Branch**: feat/tk10-4-scoped-hosts
- **História de Usuário**: US11 (Ver apenas os meus hosts)
- **Requisitos Atendidos**: RF07

## 1. Contexto e Objetivos

Escopar queries (read, readById, update, remove) e histórico de pings pelo par id + userId.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Host.ts` | Modificar | Queries escopadas por userId |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Isolamento de Hosts**:
   - Garantir que cada conta gerencie exclusivamente seus hosts.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.1 - Listagem Isolada por Dono
  Dado que o operador A está autenticado
  Quando consulta GET /api/hosts
  Então deve receber apenas os hosts cadastrados pela sua conta
```

## 5. Plano de Verificação

- **Teste de Isolamento**: Validar isolamento entre duas contas.
