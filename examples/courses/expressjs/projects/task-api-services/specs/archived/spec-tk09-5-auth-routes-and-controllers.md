# Spec TK09.5: Rotas e Controllers de Autenticação (Signup, Signin, Me)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.5
- **Branch**: feat/tk09-5-auth-routes
- **História de Usuário**: US11 (Ter uma conta), US12 (Entrar e me identificar)
- **Requisitos Atendidos**: RF04, RF05

## 1. Contexto e Objetivos

Criar src/schemas/auth.ts, src/controllers/auth-controller.ts e src/routes/auth-router.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/schemas/auth.ts` | Criar | Schemas de autenticação |
| `src/controllers/auth-controller.ts` | Criar | Controllers de auth |
| `src/routes/auth-router.ts` | Criar | Rotas sob /auth |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas de Auth**:
   - Implementar signup, signin e me sob /auth.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.2 - Resposta 401 Única no Login
  Dado uma tentativa de login com senha incorreta ou e-mail inexistente
  Quando a requisição é processada
  Então deve responder exatamente com o mesmo 401 Unauthorized e mensagem genérica
```

## 5. Plano de Verificação

- **Validação de Auth**: Testar signup, signin e consulta ao perfil.
