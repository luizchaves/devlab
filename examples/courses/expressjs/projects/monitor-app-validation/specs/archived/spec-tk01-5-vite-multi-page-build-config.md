# Spec TK01.5: Configuração de Build Multi-Página com Vite

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.5
- **Branch**: feat/tk01-5-vite-multi-page-build-config
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RNF05, RNF06

## 1. Contexto e Objetivos

Configurar front/vite.config.js com rollupOptions.input mapeando as 4 páginas HTML para empacotamento estático.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/vite.config.js` | Criar | Configuração multi-página do Vite |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração Multi-Página**:
   - Declarar entradas index, host, signin e signup no rollupOptions.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.1 - Geração de Pacote Multi-Página
  Dado o arquivo front/vite.config.js configurado
  Quando npm run build é executado
  Então a pasta dist/ deve conter index.html, host.html, signin.html e signup.html compilados
```

## 5. Plano de Verificação

- **Build Front**: Executar npm run build no front.
