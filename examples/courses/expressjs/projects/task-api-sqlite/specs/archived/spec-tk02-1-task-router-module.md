# Spec TK02.1: Roteador Modular de Tarefas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.1
- **Branch**: feat/tk02-1-task-router
- **História de Usuário**: US02 (Montar o recurso por prefixo)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Isolar as rotas do recurso de tarefas em um roteador Express modular src/routes/task-router.js com caminhos relativos.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/task-router.js` | Criar | Roteador modular para /tasks |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Roteador Express**:
   - Instanciar Router() e mapear rotas com caminhos relativos / e /:id.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.1 - Rotas Relativas
  Dado o roteador modular src/routes/task-router.js
  Quando os caminhos são analisados
  Então as rotas devem ser declaradas relativamente como "/" e "/:id"
```

## 5. Plano de Verificação

- **Checagem Modular**: Confirmar exportação de router modular.
