---
title: 'JavaScript: Módulos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Módulos

## Ideia Central

- Arquivo JavaScript isolado
- Escopo privado por padrão (variáveis, funções, classes)
- Acesso externo apenas via exportação explícita

## Sistemas de Módulos

### CommonJS (CJS)

- Padrão legado do Node.js
- Importação: `const mod = require('./lib.js')`
- Exportação default: `module.exports = valor`
- Exportação nomeada: `module.exports = { a, b }`
- Carregamento síncrono em tempo de execução

### ES Modules (ESM)

- Padrão oficial do ECMAScript (ES6+)
- Importação: `import { a } from './lib.js'`
- Exportação: `export` e `export default`
- Carregamento estático e assíncrono
- Suportado em navegadores modernos e Node.js

## Sintaxe do ES Modules (ESM)

### Named Exports & Imports

- Múltiplas exportações nomeadas por arquivo
- Declaração: `export function sum() {}`
- Importação com chaves: `import { sum } from './lib.js'`
- Aliases: `import { sum as add } from './lib.js'`
- Validação estática (extensão `.js` obrigatória em imports relativos)

### Default Exports & Imports

- No máximo um `export default` por módulo
- Declaração: `export default function() {}`
- Importação sem chaves: `import MyLib from './lib.js'`
- Nome local livre na importação
- Pode ser combinado com named exports

### Namespace Imports

- Agrupa todas as exportações: `import * as MathLib from './lib.js'`
- Acesso via propriedades: `MathLib.sum()`
- Objeto de namespace é imutável (read-only)

### Dynamic Imports

- Carregamento sob demanda em runtime
- Função: `import('caminho.js')` retorna Promise
- Exemplo: `const { power } = await import('./math.js')`
- Permite importações condicionais dentro de blocos `if`

## Resolução e Gerenciamento com npm

### Tipos de Especificadores

- Relativo: `./` ou `../` (arquivos locais do projeto)
- Pacote npm: sem `./` (buscado na pasta `node_modules`)

### Configuração do Projeto Node.js

- `package.json` com `"type": "module"`
- Comando de instalação: `npm install <pacote>`
- `package-lock.json`: trava de versões exatas
- `node_modules/`: código-fonte das dependências
- `.gitignore`: deve conter `node_modules/`

## Aplicações Práticas

### Estrutura de Serviços

- Arquivos de serviço com funções de busca (`findAll`, `findById`)
- Exportação mista (named + default)

### Carregamento Condicional

- Importação dinâmica de recursos avançados sob demanda
