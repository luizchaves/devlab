# Spec TK08.2: Configuração Prisma e Variáveis de Ambiente

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.2
- **Branch**: feat/tk08-2-prisma-config
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RF03, RNF03

## 1. Contexto e Objetivos

Criar prisma.config.ts e .env.example mantendo string de conexão fora do schema Prisma.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `prisma.config.ts` | Criar | Configuração do Prisma CLI |
| `.env.example` | Criar | Exemplo de variáveis de ambiente |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração de Ambiente**:
   - Configurar datasource URL e seed command em prisma.config.ts.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.6 - String de Conexão no Ambiente
  Dado a configuração do projeto
  Quando o Prisma Client é instanciado
  Então a URL de conexão deve ser lida do ambiente e não fixada no schema
```

## 5. Plano de Verificação

- **Checagem de Config**: Verificar leitura correta do ambiente.
