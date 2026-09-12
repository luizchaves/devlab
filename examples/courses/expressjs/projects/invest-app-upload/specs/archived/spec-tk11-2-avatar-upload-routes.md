# Spec TK11.2: Rotas de Upload e Atualização de Avatar

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.2
- **Branch**: feat/tk11-2-avatar-routes
- **História de Usuário**: US12 (Personalizar foto do perfil)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar rotas POST /api/images e PUT /api/images para upload e substituição de foto de perfil.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/images.routes.ts` | Criar | Rotas de upload |
| `back/src/controllers/images.controller.ts` | Criar | Controller de upload |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Upload de Imagens**:
   - Processar multipart, apagar imagem anterior e salvar novo arquivo.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.2 - Upload de Imagem com Sucesso
  Dado um usuário autenticado enviando um arquivo PNG válido
  Quando o POST /api/images é processado
  Então deve responder 201 com o caminho da imagem gerada
```

## 5. Plano de Verificação

- **Teste de Upload**: Fazer upload de PNG via requests.http.
