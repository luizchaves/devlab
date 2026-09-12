# Spec TK03.7: Roteador Modular de Hosts

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.7
- **Branch**: feat/tk03-7-modular-router
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/routes/hosts.routes.ts com mapeamento conciso de rotas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/hosts.routes.ts` | Criar | Roteador modular de hosts |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Roteador Limpo**:
   - Vincular métodos e rotas diretamente aos handlers do controller.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.3 - Roteador sem Lógica Inline
  Dado o roteador back/src/routes/hosts.routes.ts
  Quando as declarações são analisadas
  Então não deve conter corpos de função inline delegando aos controllers
```

## 5. Plano de Verificação

- **Inspeção de Rotas**: Validar concisão do roteador.
