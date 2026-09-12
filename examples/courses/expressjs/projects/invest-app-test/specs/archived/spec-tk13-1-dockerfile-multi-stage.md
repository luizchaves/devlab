# Spec TK13.1: Dockerfile Multi-Estágio para a API

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.1
- **Branch**: feat/tk13-1-dockerfile
- **História de Usuário**: US14 (Subir aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Criar Dockerfile multi-estágio da API com usuário não-root (node).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/Dockerfile` | Criar | Receita Docker da API |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Dockerfile API**:
   - Configurar estágios build e runner otimizados.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.4 - Processo sob Usuário Não-Root
  Dado o contêiner da API em execução
  Quando o usuário do processo é verificado
  Então deve rodar como usuário "node"
```

## 5. Plano de Verificação

- **Docker Build**: Construir imagem da API localmente.
