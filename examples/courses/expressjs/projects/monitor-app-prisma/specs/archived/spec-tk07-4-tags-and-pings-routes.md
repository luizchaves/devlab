# Spec TK07.4: Rotas para Tags e Histórico de Medições de Hosts

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.4
- **Branch**: feat/tk07-4-tags-pings-routes
- **História de Usuário**: US07 (Organizar e comparar os hosts)
- **Requisitos Atendidos**: RF02, RF03

## 1. Contexto e Objetivos

Criar rotas GET/POST para tags e consulta de pings por host (GET /api/hosts/:id/pings).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/tags.routes.ts` | Criar | Rotas de tags |
| `back/src/routes/hosts.routes.ts` | Modificar | Rota de histórico de pings |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas Relacionais**:
   - Implementar endpoints de tags e consulta de histórico.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.4 - Filtragem por Tag
  Dado que hosts possuem a tag "infra" associada
  Quando uma requisição GET /api/hosts?tag=infra é enviada
  Então deve retornar apenas os servidores associados à tag
```

## 5. Plano de Verificação

- **Filtro por Tag**: Testar GET /api/hosts?tag=infra.
