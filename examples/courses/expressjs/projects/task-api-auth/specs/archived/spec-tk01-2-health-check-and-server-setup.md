# Spec TK01.2: Entrypoint Express e Rota de Health Check

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.2
- **Branch**: feat/tk01-2-health-check-server
- **História de Usuário**: US01 (Criar e consultar tarefas por HTTP)
- **Requisitos Atendidos**: RF05, RNF01, RNF05

## 1. Contexto e Objetivos

Criar o servidor básico em src/server.js com Express 5, middleware de parsing JSON e endpoint de health check GET /health.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/server.js` | Criar | Instanciação do Express e rota GET /health |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração do Express**:
   - Importar Express e instanciar aplicação.
   - Adicionar middleware express.json().

2. **Fase 2 · Rota de Health Check**:
   - Implementar rota GET /health respondendo 200 com status "ok" e uptime.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.1 - Health Check
  Dado que o servidor Express está ativo
  Quando uma requisição "GET /health" é enviada
  Então a resposta deve ter status 200 com JSON contendo "status: ok" e uptime
```

## 5. Plano de Verificação

- **Conformidade de API**: Verificar resposta 200 em GET /health.
