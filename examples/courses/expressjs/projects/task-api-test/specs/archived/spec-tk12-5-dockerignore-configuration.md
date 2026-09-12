# Spec TK12.5: Configuração de Exclusões com .dockerignore

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.5
- **Branch**: feat/tk12-5-dockerignore
- **História de Usuário**: US21 (Subir a API em qualquer máquina)
- **Requisitos Atendidos**: RNF09

## 1. Contexto e Objetivos

Criar .dockerignore excluindo node_modules, .env, bancos de dados e uploads do contexto de build.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `.dockerignore` | Criar | Exclusão de arquivos no Docker build |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Exclusões do Docker**:
   - Prevenir vazamento de segredos e artefatos locais.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA21.4 - Exclusão de Segredos da Imagem
  Dado o arquivo .dockerignore
  Quando o contexto Docker é montado
  Então .env, node_modules e arquivos *.db não devem entrar na imagem
```

## 5. Plano de Verificação

- **Checagem de Contexto**: Validar peso e conteúdo do contexto.
