# Spec TK02.3: Rotas CRUD RESTful de Hosts com HttpError

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.3
- **Branch**: feat/tk02-3-hosts-routes
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar back/src/routes.js com rotas GET, POST, PUT, DELETE para /api/hosts e classe HttpError.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes.js` | Criar | Rotas de hosts e tratamento de erro |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas CRUD**:
   - Implementar listagem com filtro ?name=, criação 201, edição e exclusão 204.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.4 - Rejeição de Payload Incompleto
  Dado uma requisição POST /api/hosts sem o campo address
  Quando o payload é avaliado
  Então deve responder status 400 Bad Request
```

## 5. Plano de Verificação

- **Validação CRUD**: Testar endpoints via requests.http.
