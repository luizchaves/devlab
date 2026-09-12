# Spec TK06.3: Montagem do Roteador de Documentação no App

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.3
- **Branch**: feat/tk06-3-docs-mounting
- **História de Usuário**: US08 (Integrar sem ler o código)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Montar docsRouter em src/app.ts antes do middleware notFound garantindo acesso livre à documentação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/app.ts` | Modificar | Montagem do docsRouter na aplicação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Montagem no App**:
   - Plugar docsRouter antes do notFound e sem prefixo restritivo.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.5 - Montagem antes do notFound
  Dado a cadeia de middlewares em app.ts
  Quando a rota /docs é requisitada
  Então deve ser atendida pelo docsRouter sem cair no 404
```

## 5. Plano de Verificação

- **Checagem de Rota**: Validar acesso sem bloqueios de rotas.
