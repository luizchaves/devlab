# Spec TK03.4: Middleware de Aplicação para Logging

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.4
- **Branch**: feat/tk03-4-logger
- **História de Usuário**: US04 (Cada responsabilidade no seu lugar)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Criar src/middlewares/logger.js para registrar método e caminho de cada requisição e delegar execução com next().

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/logger.js` | Criar | Middleware de log simples |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Logger Simples**:
   - Criar middleware que imprime requisição e chama next().

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.6 - Delegação no Logger
  Dado que uma requisição chega ao servidor
  Quando o logger é executado
  Então deve imprimir o log e invocar next()
```

## 5. Plano de Verificação

- **Checagem de Log**: Verificar stdout durante chamadas.
