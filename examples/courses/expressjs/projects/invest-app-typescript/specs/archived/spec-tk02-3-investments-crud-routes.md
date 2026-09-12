# Spec TK02.3: Rotas CRUD de Investimentos em Memória

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.3
- **Branch**: feat/tk02-3-crud-routes
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar rotas GET, POST, PUT, DELETE para /api/investments com filtro por nome e validação básica.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes.js` | Criar | Rotas RESTful de investimentos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas CRUD**:
   - Implementar listagem com filtro ?name=, criação 201, edição e exclusão 204.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.2 - Filtro por Nome
  Dado que existem investimentos cadastrados
  Quando uma requisição GET /api/investments?name=Tesouro é enviada
  Então deve retornar apenas os registros contendo "Tesouro" no nome
```

## 5. Plano de Verificação

- **Validação CRUD**: Testar rotas via requests.http.
