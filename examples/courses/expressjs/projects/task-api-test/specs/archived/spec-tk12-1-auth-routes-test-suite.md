# Spec TK12.1: Suíte de Testes de Autenticação e Segurança com Supertest

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.1
- **Branch**: feat/tk12-1-auth-tests
- **História de Usuário**: US20 (Alterar sem quebrar o existente)
- **Requisitos Atendidos**: RNF08

## 1. Contexto e Objetivos

Criar src/routes/auth-router.test.ts cobrindo cadastro, login, omissão de senhas, conflito 409 e rejeição 401.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/auth-router.test.ts` | Criar | Testes de integração de autenticação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Testes de Auth**:
   - Escrever asserções automatizadas cobrindo todos os fluxos de autenticação.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA20.4 - Verificação Automatizada de Senhas
  Dado a suíte de testes de autenticação
  Quando os testes são executados com pnpm test
  Então deve comprovar que a senha nunca sai na resposta e falhas de login respondem 401
```

## 5. Plano de Verificação

- **Execução de Testes**: Rodar pnpm test e validar aprovação.
