# Spec TK01.4: Catálogo de Requisições HTTP Executáveis

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.4
- **Branch**: feat/tk01-4-http-catalog
- **História de Usuário**: US01 (Criar e consultar tarefas por HTTP)
- **Requisitos Atendidos**: RF01, RF05, RNF05

## 1. Contexto e Objetivos

Criar o arquivo requests.http contendo requisições HTTP executáveis para todas as rotas da API.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `requests.http` | Criar | Exemplos executáveis das rotas HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Catálogo de Requisições**:
   - Criar requests.http cobrindo GET /health, GET /tasks e POST /tasks.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.4 - Criação de Tarefa via HTTP
  Dado que o cliente envia um POST para /tasks com título
  Quando a requisição é processada
  Então deve responder 201 com id gerado
```

## 5. Plano de Verificação

- **Execução HTTP**: Validar execução no VSCode / REST Client.
