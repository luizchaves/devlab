---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Web APIs: WebAssembly"
description: "Slides completos do tópico Web APIs: WebAssembly."
---

<!-- _class: lead -->

# Web APIs: WebAssembly

Por que existe um formato binário? · Do fonte ao módulo carregado · Carregando o módulo pelo JavaScript · O exemplo em execução

---

## Objetivo

- Explicar por que existe um formato binário além do JavaScript e o que ele resolve.
- Relacionar o formato de texto (`.wat`) ao binário (`.wasm`) que o navegador carrega.
- Carregar e instanciar um módulo com `WebAssembly.instantiateStreaming()`.
- Chamar funções exportadas pelo módulo a partir do JavaScript e medir a diferença de tempo.
- Descrever a memória linear e por que strings e objetos não atravessam a fronteira sozinhos.
- Decidir, diante de um problema concreto, se WebAssembly é a ferramenta adequada.

---

## Mapa do Tópico

- **Por que existe um formato binário?**.
- **Do fonte ao módulo carregado**.
- **Carregando o módulo pelo JavaScript**.
- **O exemplo em execução**.
- **A fronteira entre os dois mundos**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Por que existe um formato binário?

O JavaScript chega ao navegador como texto.

- **Formato entregue**: Binário, validado em uma passagem.
- **Tipagem**: Estática, definida no módulo.
- **Desempenho**: Previsível, próximo ao nativo.
- **Acesso ao DOM**: Nenhum; só através do JavaScript.
- **Origem do código**: Compilado de C, C++, Rust, Go, Zig.

---

## Do fonte ao módulo carregado

O WebAssembly tem duas representações do mesmo módulo.

- O.
- wasm.
- O.

---

## Carregando o módulo pelo JavaScript

Um módulo.

- wasm.
- Ele precisa ser baixado, validado e instanciado, e é o JavaScript que faz as três coisas.
- A forma recomendada é.

---

## O exemplo em execução

O projeto tem quatro arquivos, e nenhum deles depende de instalação.

- wat fonte legível do módulo ├── math.
- wasm binário de 109 bytes carregado pela página ├── build-wasm.

---

## A fronteira entre os dois mundos

A limitação que mais surpreende quem chega ao WebAssembly é a dos tipos.

- **Número inteiro ou de ponto flutuante**: Ninguém, o tipo já é comum aos dois lados.
- **String**: Código de cola gerado pelo compilador.
- **Array numérico**: O JavaScript, ao criar a visão.
- **Objeto**: O programador ou o compilador.
- **Acesso ao DOM**: O JavaScript, sempre.

---

## Quando usar, e quando não usar?

WebAssembly é uma ferramenta especializada.

- **Edição de imagem, áudio ou vídeo no navegador**: Laços numéricos pesados, sem acesso ao DOM.
- **Reaproveitar uma biblioteca existente em C ou Ru**: Evita reescrever e revalidar algoritmo consolidado.
- **Motor de física, simulação ou jogo**: Desempenho previsível a cada quadro.
- **Interface lenta por excesso de alterações no DOM**: O módulo não alcança o DOM; o gargalo continua onde.
- **Cálculo pesado que trava a tela**: O problema é bloquear a *thread*, não a velocidade do cálculo.

---

## Executando

1. Entre na pasta do exemplo, em `examples/courses/web-api/webassembly/`.
2. Regere o binário e confira a validação.
3. Sirva a pasta por HTTP, porque `file://` não funciona com `instantiateStreaming()`.
4. Abra o endereço informado, clique em Comparar e anote os dois tempos.

---

## Executando: Comando

```bash
node build-wasm.mjs math.wasm
```

---

## Executando: Resultado

```txt
bytes: 109 valid: true
   add(2,3) = 5
   fib confere de 0 a 30: true | fib(30) = 832040
```

---

## Exercício Prático

1. Chame `instance.exports.add(7, 5)` no console e confirme o resultado.
2. Passe `add(1.5, 2.5)` e explique o valor devolvido, lembrando que os parâmetros são `i32`.
3. Meça `fib(40)` com 1000 repetições e compare os tempos das duas implementações.
4. Force o erro de protocolo abrindo o `index.html` por duplo clique e leia a mensagem no console.
5. Substitua `instantiateStreaming()` por `instantiate()` com `arrayBuffer()` e verifique.

---

## Desafio

Acrescente ao módulo uma terceira função e leve-a até a interface, exercitando o ciclo completo de alteração do binário.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Por que o WebAssembly não substitui o JavaScript?
2. Qual a relação entre `.wat` e `.wasm`?
3. Por que `instantiateStreaming()` é preferível a `instantiate()` com `arrayBuffer()`?
4. Por que abrir o exemplo por `file://` produz um erro?
5. Quais tipos podem aparecer diretamente na assinatura de uma função exportada?

---

## Resumo do Tópico

- **Por que existe um formato binário?**: revise o papel desse eixo no uso da API.
- **Do fonte ao módulo carregado**: revise o papel desse eixo no uso da API.
- **Carregando o módulo pelo JavaScript**: revise o papel desse eixo no uso da API.
- **O exemplo em execução**: revise o papel desse eixo no uso da API.
- **A fronteira entre os dois mundos**: revise o papel desse eixo no uso da API.
