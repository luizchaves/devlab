# Spec TK07.5: Rotas e Controllers para Categorias e Corretoras

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.5
- **Branch**: feat/tk07-5-category-broker-routes
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar rotas GET/POST para /api/categories e /api/brokers com controllers dedicados.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/categories.routes.ts` | Criar | Rotas de categorias |
| `back/src/routes/brokers.routes.ts` | Criar | Rotas de corretoras |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Recursos de Apoio**:
   - Implementar listagem e cadastro de categorias e corretoras.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.4 - Rejeição de FK Inexistente
  Dado uma tentativa de vincular categoria inexistente
  Quando o backend valida o ID
  Então deve responder status 400 Bad Request
```

## 5. Plano de Verificação

- **Teste de FK**: Testar criação com IDs inválidos.
