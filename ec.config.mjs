// @ts-check
import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

/**
 * Configuracao do Expressive Code.
 *
 * Fica em um arquivo separado (e nao dentro de `astro.config.mjs`) porque o
 * componente `<Code>` — usado pelo `<SourceCode>` — precisa carregar estas
 * opcoes em tempo de renderizacao, e plugins nao sao serializaveis em JSON.
 *
 * Recursos habilitados:
 * - syntax highlighting com Shiki e temas para dark/light mode;
 * - botao "Copy" (padrao do plugin de frames);
 * - `title` / filename e frames de editor e de terminal;
 * - `showLineNumbers` e `startLineNumber`;
 * - destaque de linhas (`{1-3}` / `mark`) e de trechos de texto;
 * - `ins` e `del` para linhas adicionadas e removidas, alem de `lang="diff"`;
 * - `wrap` e `preserveIndent` para quebra de linha;
 * - `collapse` para secoes recolhiveis.
 */
export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  styleOverrides: {
    borderRadius: '0.5rem',
    codeFontSize: '0.875rem',
  },
  defaultProps: {
    // Numeros de linha ficam sob demanda (`showLineNumbers`), para nao poluir
    // blocos curtos e comandos de terminal.
    showLineNumbers: false,
    wrap: false,
    overridesByLang: {
      'bash,sh,shell,zsh,console,powershell': {
        frame: 'terminal',
        showLineNumbers: false,
      },
    },
  },
});
