# Spec TK04.3: Tratamento de Issues Zod no HttpError

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.3
- **Branch**: feat/tk04-3-zod-issues
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Tratar issues Zod no HttpError e serializar lista de problemas no envelope de resposta 400.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/errors/HttpError.ts` | Modificar | Suporte a issues no HttpError |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Serialização de Issues**:
   - Adicionar issues ao HttpError e formatar JSON de resposta.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.2 - Identificação de Fonte da Issue
  Dado uma issue de validação gerada pelo Zod
  Quando a resposta é montada
  Então deve indicar a fonte exata do problema (body, params ou query)
```

## 5. Plano de Verificação

- **Checagem de Issues**: Verificar paths de erro na resposta.
