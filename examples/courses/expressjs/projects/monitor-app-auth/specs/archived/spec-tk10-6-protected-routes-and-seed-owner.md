# Spec TK10.6: Proteção de Rotas Privadas e Seed com Usuário Proprietário

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.6
- **Branch**: feat/tk10-6-protect-routes-seed
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Proteger rotas de hosts com isAuthenticated e associar dados iniciais de seed a um usuário proprietário.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/hosts.routes.ts` | Modificar | Proteção de rotas com middleware |
| `back/prisma/seed.ts` | Modificar | Seed associado a usuário |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas Protegidas**:
   - Aplicar middleware isAuthenticated e atualizar seed.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.4 - Rejeição de Token Inválido
  Dado um token JWT adulterado ou expirado
  Quando uma rota protegida é chamada
  Então deve responder 401 Unauthorized
```

## 5. Plano de Verificação

- **Validação de Token**: Testar token expirado e validar 401.
