# Spec TK09.2: Criptografia de Senhas com Argon2id e Sal Individual

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.2
- **Branch**: feat/tk09-2-password-argon2id
- **História de Usuário**: US11 (Ter uma conta)
- **Requisitos Atendidos**: RF04, RNF02

## 1. Contexto e Objetivos

Criar src/utils/password.ts com hashPassword e verifyPassword em formato PHC ($argon2id$) utilizando node:crypto e timingSafeEqual.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/utils/password.ts` | Criar | Hash e verificação de senhas |
| `src/utils/password.test.ts` | Criar | Testes de segurança de senhas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Criptografia de Senhas**:
   - Implementar hash e verificação em tempo constante sem pacotes externos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.3 - Formato Seguro do Hash
  Dado duas senhas iguais cadastradas por usuários distintos
  Quando os hashes são gerados
  Então devem iniciar com $argon2id$ e produzir strings diferentes devido ao sal individual
```

## 5. Plano de Verificação

- **Teste Criptográfico**: Executar testes de tempo constante e sais únicos.
