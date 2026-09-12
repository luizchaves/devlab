# Spec TK09.5: Proteção de Rotas Privadas e Endpoint /api/users/me

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.5
- **Branch**: feat/tk09-5-protected-routes
- **História de Usuário**: US09 (Entrar no sistema)
- **Requisitos Atendidos**: RF03

## 1. Contexto e Objetivos

Aplicar isAuthenticated nas rotas de investimentos e criar endpoint GET /api/users/me.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/investments.routes.ts` | Modificar | Proteção com middleware de auth |
| `back/src/routes/users.routes.ts` | Modificar | Rota GET /api/users/me |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas Privadas**:
   - Proteger rotas e fornecer endpoint de consulta ao perfil autenticado.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.4 - Rejeição de Token Adulterado
  Dado um token JWT com assinatura inválida ou expirado
  Quando uma rota protegida é requisitada
  Então deve responder 401 Unauthorized
```

## 5. Plano de Verificação

- **Validação de Token**: Enviar token adulterado e validar rejeição.
