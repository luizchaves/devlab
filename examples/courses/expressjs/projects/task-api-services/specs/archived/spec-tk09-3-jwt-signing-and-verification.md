# Spec TK09.3: Emissão e Validação Nativa de Tokens JWT

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.3
- **Branch**: feat/tk09-3-jwt-auth
- **História de Usuário**: US12 (Entrar e me identificar)
- **Requisitos Atendidos**: RF05

## 1. Contexto e Objetivos

Criar src/utils/jwt.ts com signJwt e verifyJwt (HS256 com createHmac) e validação de expiração.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/utils/jwt.ts` | Criar | Utilitário JWT nativo |
| `src/utils/jwt.test.ts` | Criar | Testes de integridade de JWT |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Utilitário JWT**:
   - Implementar assinatura e verificação HS256 com tratamento de expiração.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.1 - Login com Emissão de Token
  Dado credenciais válidas de usuário
  Quando um POST /auth/signin é enviado
  Então deve responder 200 com token JWT assinado e dados públicos do usuário
```

## 5. Plano de Verificação

- **Teste de Token**: Assinar, verificar e validar adulteração de token.
