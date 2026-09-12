# Spec TK08.2: Utilitário de Hash Argon2id com Sal Individual

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.2
- **Branch**: feat/tk08-2-password-util
- **História de Usuário**: US08 (Ter uma carteira própria)
- **Requisitos Atendidos**: RF02, RNF02

## 1. Contexto e Objetivos

Criar back/src/utils/password.ts com hashPassword e verifyPassword em formato $argon2id$ usando node:crypto.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/utils/password.ts` | Criar | Utilitário de criptografia de senhas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Criptografia Segura**:
   - Implementar Argon2id com sal individual e verificação timingSafeEqual.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.4 - Hash Seguro com Sal Individual
  Dado duas senhas iguais cadastradas por investidores distintos
  Quando os hashes são gerados
  Então devem produzir strings distintas iniciando com $argon2id$
```

## 5. Plano de Verificação

- **Teste de Hash**: Validar geração de sais únicos.
