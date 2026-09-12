# Spec TK02.1: Configuração do Servidor Express e CORS

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.1
- **Branch**: feat/tk02-1-express-server
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar servidor Express em back/src/server.js com middlewares Morgan, CORS e express.json().

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/server.js` | Criar | Entrypoint do backend com Express e CORS |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Servidor Express**:
   - Instanciar Express, plugar Morgan, CORS e express.json().

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.1 - Inicialização do Servidor
  Dado o servidor back/src/server.js
  Quando o comando npm run dev é executado no backend
  Então deve iniciar e atender requisições na porta configurada
```

## 5. Plano de Verificação

- **Teste de Inicialização**: Subir servidor e checar resposta.
