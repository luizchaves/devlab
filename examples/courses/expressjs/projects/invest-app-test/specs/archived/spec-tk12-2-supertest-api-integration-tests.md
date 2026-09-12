# Spec TK12.2: Testes de Integração de Endpoints com Supertest

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.2
- **Branch**: feat/tk12-2-supertest-integration
- **História de Usuário**: US13 (Alterar sem quebrar o existente)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Criar testes de rotas cobrindo CRUD de investimentos, categorias, corretoras e autenticação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/tests/integration/routes.test.ts` | Criar | Testes de integração HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Testes de Integração**:
   - Cobrir ciclo completo de requisições e respostas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA13.5 - Teste de Isolamento por Dono
  Dado dois usuários cadastrados na suíte de testes
  Quando um usuário tenta consultar recursos do outro
  Então as asserções devem validar resposta 404
```

## 5. Plano de Verificação

- **Testes Supertest**: Executar suíte de integração.
