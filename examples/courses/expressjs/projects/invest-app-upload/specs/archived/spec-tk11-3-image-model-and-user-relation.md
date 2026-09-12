# Spec TK11.3: Entidade Image e Associação ao Perfil do Usuário

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.3
- **Branch**: feat/tk11-3-image-model
- **História de Usuário**: US12 (Personalizar foto do perfil)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Modelar entidade Image no Prisma vinculando ao User e gerando migração versionada.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/prisma/schema.prisma` | Modificar | Model Image e relação com User |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema de Imagens**:
   - Adicionar model Image e atualizar modelo User.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.7 - Substituição de Imagem
  Dado que o investidor já possui uma foto cadastrada
  Quando envia uma nova foto de perfil
  Então a imagem anterior deve ser excluída e o registro atualizado
```

## 5. Plano de Verificação

- **Migração de Imagem**: Executar npx prisma migrate dev.
