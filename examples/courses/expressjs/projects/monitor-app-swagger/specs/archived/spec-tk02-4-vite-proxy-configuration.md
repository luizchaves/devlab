# Spec TK02.4: Configuração de Proxy /api no Vite para Duas Origens

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.4
- **Branch**: feat/tk02-4-vite-proxy
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Configurar proxy /api em front/vite.config.js encaminhando requisições para http://localhost:3000 em dev sem preflight de CORS.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/vite.config.js` | Modificar | Proxy de desenvolvimento do Vite |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Proxy Vite**:
   - Adicionar server.proxy direcionando /api para a porta do backend.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.8 - Proxy sem Preflight de CORS
  Dado o front-end executando no Vite
  Quando chamadas fetch("/api/hosts") são disparadas
  Então o Vite deve encaminhar as requisições ao backend sem disparar preflight OPTIONS
```

## 5. Plano de Verificação

- **Teste de Proxy**: Testar requisições do front para /api sem erro de CORS.
