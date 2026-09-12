# Spec TK12.4: Dockerfile Multi-Estágio com Usuário sem Privilégio

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.4
- **Branch**: feat/tk12-4-dockerfile
- **História de Usuário**: US21 (Subir a API em qualquer máquina)
- **Requisitos Atendidos**: RNF09

## 1. Contexto e Objetivos

Criar Dockerfile multi-estágio com build otimizado, usuário app não-root e HEALTHCHECK em /health.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `Dockerfile` | Criar | Receita de imagem de produção |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Empacotamento Docker**:
   - Configurar estágios build e runner com permissões de usuário app.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA21.3 - Execução como Usuário Não-Root
  Dado a imagem Docker construída
  Quando o contêiner é inicializado
  Então o processo deve rodar sob o usuário app
```

## 5. Plano de Verificação

- **Docker Build**: Construir imagem localmente.
