# Spec TK02.3: Isolamento do Entrypoint de Execução do Servidor

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.3
- **Branch**: feat/tk02-3-server-entrypoint
- **História de Usuário**: US02 (Montar o recurso por prefixo)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Reduzir src/server.js a importar src/app.js e escutar a porta HTTP.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/server.js` | Modificar | Inicialização da porta HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Entrypoint Limpo**:
   - Importar app e escutar PORT.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.4 - Preservação de Contrato
  Dado que o servidor é iniciado via src/server.js
  Quando as requisições de requests.http são executadas
  Então todos os endpoints devem responder com os mesmos status codes
```

## 5. Plano de Verificação

- **Verificação de Porta**: Subir servidor e checar resposta.
