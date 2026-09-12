# Spec TK04.4: Migração de Camadas para TypeScript Nativo

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.4
- **Branch**: feat/tk04-4-ts-layers-migration
- **História de Usuário**: US05 (Deixar o compilador apontar a quebra)
- **Requisitos Atendidos**: RNF04, RNF10

## 1. Contexto e Objetivos

Migrar app, server, router, controller, model e error-handler para .ts com função de conversão parseId.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/server.ts` | Criar / Renomear | Entrypoint do servidor em TS |
| `src/app.ts` | Criar / Renomear | Aplicação Express em TS |
| `src/routes/task-router.ts` | Criar / Renomear | Roteador em TS |
| `src/controllers/task-controller.ts` | Criar / Renomear | Controller em TS |
| `src/models/task-model.ts` | Criar / Renomear | Model em TS |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Migração de Código**:
   - Converter todos os arquivos JS para TS e tipar parâmetros.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.4 - Validação de ID Numérico
  Dado que uma requisição GET /tasks/abc é enviada
  Quando o controller processa o ID
  Então deve responder 400 informando que o ID deve ser inteiro
```

## 5. Plano de Verificação

- **Execução TS**: Rodar dev e checar rotas.
