# Spec TK11.2: Controller de Avatar e Serviço de Arquivos Estáticos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.2
- **Branch**: feat/tk11-2-avatar-controller
- **História de Usuário**: US17 (Ter uma foto de perfil)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Criar src/controllers/avatar-controller.ts, rota POST /auth/me/avatar e express.static de uploads/ em app.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/controllers/avatar-controller.ts` | Criar | Upload de foto de perfil |
| `src/app.ts` | Modificar | Serviço estático de uploads/ |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Upload e Serviço de Avatar**:
   - Gravar caminho no usuário, apagar avatar antigo e servir via express.static.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA17.2 - Upload de Imagem de Perfil
  Dado um usuário autenticado enviando uma imagem PNG válida
  Quando o POST /auth/me/avatar é processado
  Então deve responder 201 com a URL pública do avatar
```

## 5. Plano de Verificação

- **Teste de Avatar**: Fazer upload de PNG e acessar URL pública.
