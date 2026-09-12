# Spec TK13.3: Configuração de Exclusões com .dockerignore

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.3
- **Branch**: feat/tk13-3-dockerignore
- **História de Usuário**: US14 (Subir a aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05, RNF09

## 1. Contexto e Objetivos

Criar .dockerignore para backend e front-end excluindo node_modules, .env e arquivos temporários.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `.dockerignore` | Criar | Exclusão no build do Docker |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Exclusões**:
   - Isolar contexto Docker excluindo dependências e dados locais.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.3 - Variáveis Injetadas via Compose
  Dado o arquivo .dockerignore
  Quando o contexto Docker é montado
  Então arquivos .env locais não devem entrar na imagem
```

## 5. Plano de Verificação

- **Contexto Docker**: Checar arquivos no contexto.
