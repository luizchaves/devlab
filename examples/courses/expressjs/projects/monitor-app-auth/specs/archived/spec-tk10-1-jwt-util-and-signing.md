# Spec TK10.1: Utilitário JWT com Assinatura HS256 e Verificação

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.1
- **Branch**: feat/tk10-1-jwt-util
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar back/src/utils/jwt.ts com signJwt e verifyJwt usando node:crypto.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/utils/jwt.ts` | Criar | Utilitário JWT |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Utilitário JWT**:
   - Assinar e verificar tokens HS256 com tratamento de expiração.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.1 - Login com Emissão de Token
  Dado credenciais válidas de operador
  Quando um POST /api/signin é processado
  Então deve responder 200 com token JWT assinado
```

## 5. Plano de Verificação

- **Teste de Token**: Assinar e validar tokens.
