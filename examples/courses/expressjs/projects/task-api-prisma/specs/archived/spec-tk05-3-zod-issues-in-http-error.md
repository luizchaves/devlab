# Spec TK05.3: Tratamento de Issues do Zod em HttpError

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.3
- **Branch**: feat/tk05-3-zod-issues-error
- **História de Usuário**: US06 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Modificar HttpError.ts e error-handler.ts para transportar issues do Zod e responder 422 estruturado.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/errors/HttpError.ts` | Modificar | Propriedade issues no HttpError |
| `src/middlewares/error-handler.ts` | Modificar | Serialização de issues na resposta |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Formatação de Erros**:
   - Incluir campo issues opcional no HttpError e serializar no envelope de resposta.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.1 - Múltiplas Issues na Resposta
  Dado uma requisição com múltiplos campos inválidos
  Quando o errorHandler responde o 422
  Então deve incluir uma lista com todas as issues apontadas
```

## 5. Plano de Verificação

- **Teste de Erros**: Validar resposta com múltiplos campos inválidos.
