# Spec TK02.6: Catálogo de Requisições HTTP Executáveis

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.6
- **Branch**: feat/tk02-6-http-catalog
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar back/requests.http com requisições documentadas para todas as rotas de gerenciamento de hosts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/requests.http` | Criar | Catálogo de requisições HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Catálogo HTTP**:
   - Documentar rotas GET, POST, PUT e DELETE de hosts.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.3 - POST 201 com ID Gerado
  Dado um novo host com name e address
  Quando o POST /api/hosts é executado
  Então deve responder 201 com o ID gerado
```

## 5. Plano de Verificação

- **Execução HTTP**: Testar requisições em requests.http.
