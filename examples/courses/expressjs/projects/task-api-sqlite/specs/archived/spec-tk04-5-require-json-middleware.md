# Spec TK04.5: Middleware de Verificação de Content-Type JSON

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.5
- **Branch**: feat/tk04-5-require-json
- **História de Usuário**: US05 (Deixar o compilador apontar a quebra)
- **Requisitos Atendidos**: RNF04, RNF10

## 1. Contexto e Objetivos

Criar src/middlewares/require-json.ts recusando requisições com corpo sem Content-Type application/json com status 415.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/require-json.ts` | Criar | Middleware de checagem MIME type |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Validação MIME**:
   - Checar Content-Type em requisições POST/PUT e responder 415 se inválido.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.5 - Rejeição de Content-Type Inválido
  Dado que uma requisição POST /tasks é enviada com Content-Type text/plain
  Quando o middleware require-json avalia o cabeçalho
  Então deve responder status 415 Unsupported Media Type
```

## 5. Plano de Verificação

- **Teste MIME**: Enviar payload com formato texto e checar 415.
