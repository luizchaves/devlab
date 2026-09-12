# Spec TK02.2: Composição da Aplicação Desacoplada do Socket

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.2
- **Branch**: feat/tk02-2-app-composition
- **História de Usuário**: US02 (Montar o recurso por prefixo)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Criar src/app.js montando express.json() e roteador sob /tasks, exportando app sem abrir socket de rede.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/app.js` | Criar | Montagem e exportação da instância Express |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Montagem da Aplicação**:
   - Montar express.json() e taskRouter sob o prefixo /tasks.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.3 - Desacoplamento de Socket
  Dado que src/app.js é importado em outro módulo
  Quando a aplicação é instanciada
  Então nenhuma porta de rede deve ser aberta
```

## 5. Plano de Verificação

- **Teste de Importação**: Importar app sem disparar listen.
