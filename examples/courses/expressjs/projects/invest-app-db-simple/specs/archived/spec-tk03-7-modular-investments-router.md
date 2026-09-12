# Spec TK03.7: Roteador Modular de Investimentos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.7
- **Branch**: feat/tk03-7-modular-router
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/routes/investments.routes.ts com rotas limpas mapeando método, rota e controller.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/investments.routes.ts` | Criar | Roteador de investimentos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Roteador Limpo**:
   - Mapear rotas sem lógica inline delegando diretamente aos controllers.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.3 - Roteador Limpo
  Dado o roteador back/src/routes/investments.routes.ts
  Quando a declaração de rotas é lida
  Então cada linha deve apenas ligar método, caminho e handler do controller
```

## 5. Plano de Verificação

- **Inspeção de Rotas**: Checar concisão do roteador.
