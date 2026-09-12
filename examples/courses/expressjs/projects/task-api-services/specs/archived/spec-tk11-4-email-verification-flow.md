# Spec TK11.4: Fluxo de Confirmação de E-mail com Token Temporário

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.4
- **Branch**: feat/tk11-4-email-verification
- **História de Usuário**: US16 (Confirmar que o e-mail é meu)
- **Requisitos Atendidos**: RF07

## 1. Contexto e Objetivos

Modificar schema Prisma, user-model.ts e auth-controller.ts para incluir verifyToken, verifiedAt e rota GET /auth/verify.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `prisma/schema.prisma` | Modificar | Campos de verificação de conta |
| `src/controllers/auth-controller.ts` | Modificar | Rota de verificação GET /auth/verify |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Verificação de Conta**:
   - Gerar token de verificação e validar rota GET /auth/verify.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA16.3 - Confirmação de Conta com Sucesso
  Dado um link de verificação contendo token válido
  Quando o endpoint GET /auth/verify é acionado
  Então deve responder 200 com status "verified" e preencher verifiedAt
```

## 5. Plano de Verificação

- **Teste de Verificação**: Consumir token e verificar status de confirmação.
