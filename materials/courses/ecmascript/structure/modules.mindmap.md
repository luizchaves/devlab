---
title: 'JavaScript: Módulos ES (ESM)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Módulos ES (ESM)

## Objetivo
- Compreender modularização e diferenciar CommonJS de ES Modules.

## O que acontece sem módulos?
- Se você tentar declarar uma função em um arquivo e chamá-la em outro sem exportar nem importar

## Sistemas de módulos em JavaScript
- Historicamente, JavaScript não possuía um sistema oficial de módulos.
- Para resolver isso no desenvolvimento de aplicações no servidor com Node.js, surgiram padrões como o CommonJS.
- A partir do ES6 (ES2015), o ecossistema padronizou o ES Modules (ESM).

## CommonJS (CJS)
- No estilo CommonJS, a exportação é feita atribuindo valores ao objeto `module.exports`.
- Para exportar um único valor principal (default export no estilo CommonJS)
- Para exportar múltiplos valores nomeados no CommonJS, atribui-se um objeto ao `module.exports`

## Exports e imports nomeados
- Com o ES Modules (ESM), um módulo pode conter quantas exportações nomeadas (named exports) forem necessárias.
- Cada exportação deve possuir um nome único dentro do arquivo.
- Na importação, membros nomeados são extraídos com chaves, como em `import { sum }`.
- Caso seja necessário evitar conflitos de nomes ou melhorar a intenção.

## Export e import default
- O export default é usado para definir o valor principal de um módulo (por exemplo.
- Cada módulo pode ter no máximo um `export default`.
- Ao importar um export default, não são utilizadas chaves `{}` e o nome da variável local é livre

## Import de namespace (`import * as`)
- Quando um módulo expõe diversas exportações nomeadas (e opcionalmente um export default).

## Imports dinâmicos (`import()`)
- Instruções `import` estáticas devem ser colocadas no nível superior (top-level) do arquivo.
- Elas são analisadas antes da execução do código.
- Se você precisar carregar um módulo sob demanda, condicionalmente ou dentro de uma função.

## Avaliação única e Vínculos Vivos (Live Bindings)
- Dois comportamentos fundamentais caracterizam a execução dos ES Modules no JavaScript
### 1. Avaliação Única (*Singleton Evaluation*)
- Um módulo é executado apenas uma única vez, na primeira oportunidade em que é importado.
- Se múltiplos arquivos da aplicação importarem o mesmo módulo `./counter.js`.
### 2. Vínculos Vivos (*Live Bindings*)
- As exportações em ESM não são cópias dos valores, mas vínculos vivos (live bindings).
- Quando o módulo de origem altera o valor de uma variável exportada através de uma função interna.
- Contudo, o arquivo que importa o valor não pode reatribuí-lo diretamente.

## Resolução de módulos e regras no Node.js
### Obrigatoriedade da extensão em ESM
- Em ES Modules no Node.js, imports relativos devem informar a extensão do arquivo.
### Especificadores relativos vs. pacotes npm
- Especificador relativo: Começa obrigatoriamente com `./` ou `../` e indica o caminho para um arquivo local do projeto.
- Especificador de pacote: Não possui `./` ou `../`. O Node.js busca a biblioteca dentro da pasta `node_modules`.
- Para utilizar pacotes da comunidade como `mathjs`, é necessário instalá-los através de um gerenciador de pacotes.
- Antes da instalação, o `package.json` possui a configuração básica do projeto
- No terminal, execute o comando de instalação do pacote de acordo com o gerenciador de sua preferência
### Versionamento semântico (SemVer)
- Prefixo: Exemplo; Descrição de atualização
- `^` (caret): `"^14.0.1"`; Permite atualizações MINOR e PATCH (ex: `< 15.0.0`). É o padrão do npm.
- `~` (tilde): `"~14.0.1"`; Permite apenas atualizações de PATCH (ex: `< 14.1.0`).
- Nenhum: `"14.0.1"`; Trava a dependência na versão exata especificada.
- MAJOR (`14`): Mudanças incompatíveis que podem quebrar o código existente (breaking changes).

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
