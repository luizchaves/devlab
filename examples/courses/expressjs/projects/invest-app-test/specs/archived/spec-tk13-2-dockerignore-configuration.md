# Spec TK13.2: Configuração de Exclusão com .dockerignore

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.2
- **Branch**: feat/tk13-2-dockerignore
- **História de Usuário**: US14 (Subir aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Criar .dockerignore para backend e front-end excluindo dependências e arquivos temporários.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `.dockerignore` | Criar | Exclusão no build do Docker |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Exclusões**:
   - Isolar contexto Docker excluindo node_modules e .env.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.3 - Segredos Fora da Imagem
  Dado o arquivo .dockerignore
  Quando o contexto Docker é montado
  Então variáveis sensíveis e .env não devem entrar na imagem
```

## 5. Plano de Verificação

- **Contexto Docker**: Checar arquivos no contexto.
