# Spec TK09.1: Utilitário JWT e Middleware de Autenticação

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.1
- **Branch**: feat/tk09-1-jwt-auth
- **História de Usuário**: US09 (Entrar no sistema)
- **Requisitos Atendidos**: RF03

## 1. Contexto e Objetivos

Criar back/src/utils/jwt.ts e back/src/middlewares/isAuthenticated.ts para validação de Bearer token.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/utils/jwt.ts` | Criar | Emissão e verificação de tokens JWT |
| `back/src/middlewares/isAuthenticated.ts` | Criar | Middleware de proteção de rotas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Autenticação JWT**:
   - Assinar e verificar tokens HS256 e injetar usuário autenticado no request.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.3 - Bloqueio sem Token
  Dado uma rota privada do InvestApp
  Quando uma requisição sem cabeçalho Authorization é enviada
  Então deve responder status 401 Unauthorized
```

## 5. Plano de Verificação

- **Teste de Bloqueio**: Requisitar rota privada sem token.
