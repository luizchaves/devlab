---
title: 'Web APIs: WebAssembly'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: WebAssembly

## Ideia Central
- **Papel**: Execução de código compilado no navegador com WebAssembly: formato binário, instanciação por JavaScript, memória linear, comparação de desempenho e casos em que ele não se justifica
- **Contexto**: O WebAssembly (abreviado como Wasm) é um formato binário que o navegador executa ao lado do JavaScript. Ele não substitui a linguagem da web: ele acrescenta um caminho para rodar código escrito em C, C++, Rust, Go ou Zig dentro da mesma página, com desempenho próximo ao nativo
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Por que existe um formato binário?
- **Ideia**: O JavaScript chega ao navegador como texto
- **Detalhe**: Antes de executar, o motor precisa analisá-lo, montar uma representação interna e compilá-lo em etapas, otimizando com base no que observa durante a execução

## Do fonte ao módulo carregado
- **Ideia**: O WebAssembly tem duas representações do mesmo módulo
- **Detalhe**: O `

## Carregando o módulo pelo JavaScript
- **Ideia**: Um módulo `
- **Detalhe**: wasm` não roda sozinho

## O exemplo em execução
- **Ideia**: O projeto tem quatro arquivos, e nenhum deles depende de instalação: webassembly/ ├── math
- **Detalhe**: wat fonte legível do módulo ├── math

## A fronteira entre os dois mundos
- **Ideia**: A limitação que mais surpreende quem chega ao WebAssembly é a dos tipos
- **Detalhe**: Um módulo só troca números com o JavaScript: `i32`, `i64`, `f32` e `f64`

## Quando usar, e quando não usar?
- **Ideia**: WebAssembly é uma ferramenta especializada
- **Detalhe**: Ele acrescenta um artefato binário ao projeto, uma etapa de compilação e uma fronteira de tipos a administrar, e esse custo só se paga quando o gargalo é mesmo de processamento

## Executando
- **Ideia**: Siga os passos para rodar o exemplo localmente e observar a diferença entre as duas implementações: Entre na pasta do exemplo, em `examples/courses/web-api/webassembly/`
- **Detalhe**: Regere o binário e confira a validação: Sirva a pasta por HTTP, porque `file://` não funciona com `instantiateStreaming()`: Abra o endereço informado, clique em Comparar e anote os dois tempos
- **Ponto**: Entre na pasta do exemplo, em `examples/courses/web-api/webassembly/`
- **Ponto**: Regere o binário e confira a validação:
- **Ponto**: Sirva a pasta por HTTP, porque `file://` não funciona com `instantiateStreaming()`:
- **Ponto**: Abra o endereço informado, clique em Comparar e anote os dois tempos

## Exercício
- **Ideia**: Os itens abaixo partem do exemplo já em execução e exercitam a fronteira entre os dois formatos: Chame `instance
- **Detalhe**: exports
- **Ponto**: Chame `instance.exports.add(7, 5)` no console e confirme o resultado
- **Ponto**: Passe `add(1.5, 2.5)` e explique o valor devolvido, lembrando que os parâmetros são `i32`
- **Ponto**: Meça `fib(40)` com 1000 repetições e compare os tempos das duas implementações
- **Ponto**: Force o erro de protocolo abrindo o `index.html` por duplo clique e leia a mensagem no console

## Desafio
- **Ideia**: Acrescente ao módulo uma terceira função e leve-a até a interface, exercitando o ciclo completo de alteração do binário
- **Detalhe**: O desafio é escrever `mul(a, b)`, exportá-la e usá-la na página para exibir o produto de dois campos numéricos

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o formato binário, compilação, streaming e limitações de arquitetura do WebAssembly:
- **Ponto**: Por que o WebAssembly não substitui o JavaScript?
- **Ponto**: Qual a relação entre `.wat` e `.wasm`?
- **Ponto**: Por que `instantiateStreaming()` é preferível a `instantiate()` com `arrayBuffer()`?
- **Ponto**: Por que abrir o exemplo por `file://` produz um erro?
### Formato e carregamento
- **Ideia**: As questões a seguir avaliam a representação em texto versus binário e as funções de instanciação no navegador: Por que o WebAssembly não substitui o JavaScript?
- **Ponto**: Por que o WebAssembly não substitui o JavaScript?
- **Ponto**: Qual a relação entre `.wat` e `.wasm`?
### Fronteira e decisão
- **Ideia**: As questões a seguir avaliam a troca de dados pela memória linear e o escopo de atuação do WASM: Quais tipos podem aparecer diretamente na assinatura de uma função exportada?
- **Ponto**: Quais tipos podem aparecer diretamente na assinatura de uma função exportada?
- **Ponto**: O que é a memória linear de um módulo?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
