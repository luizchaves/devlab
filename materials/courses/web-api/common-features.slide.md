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
title: "Web APIs: O que uma Aplicação Front-end Faz?"
description: "Slides completos do tópico Web APIs: O que uma Aplicação Front-end Faz?."
---

<!-- _class: lead -->

# Web APIs: O que uma Aplicação Front-end Faz?

O mapa por funcionalidade · Funcionalidades Recorrentes em Código

---

## Objetivo

- Nomear a Web API responsável por cada funcionalidade recorrente de uma aplicação vanilla.
- Reconhecer o trecho mínimo de código de cada uma dessas tarefas.
- Identificar quais dessas funcionalidades o HTML e o CSS já resolvem sem JavaScript.
- Localizar, no guia, a página que aprofunda cada API citada aqui.
- Ler uma aplicação pequena e apontar qual API sustenta cada parte dela.

---

## Mapa do Tópico

- **O mapa por funcionalidade**.
- **Funcionalidades Recorrentes em Código**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O mapa por funcionalidade

Ao projetar ou construir uma aplicação front-end, o desenvolvedor pensa em termos de necessidades de negócio e funcionalidades para o usuário.

- **Encontrar e alterar o conteúdo de elementos**: Manipulação do DOM.
- **Alterar estilos e classes visuais**: Manipulação do DOM.
- **Reagir a clique, tecla e envio de formulário**: Eventos e Interatividade.
- **Configurar ações e atalhos de teclado**: Eventos e Interatividade.
- **Atender itens que ainda não existem**: Eventos e Interatividade.
- **Montar listas e cartões a partir dos dados**: Elementos Dinâmicos.

---

## Funcionalidades Recorrentes em Código

A seguir, analisamos a implementação prática das tarefas mais recorrentes em aplicações front-end vanilla, com trechos mínimos de código.

- **Tema, idioma, ordenação da lista**: Só o navegador precisa, e deve sobreviver ao fechamento.
- **Rascunho válido até fechar a aba**: Expira sozinho, sem código de limpeza.
- **Sessão autenticada**: O servidor precisa a cada requisição, e o script não deve ler.
- **Dados que o usuário verá em outro aparelho**: Nada guardado no navegador atravessa dispositivos.
- **Funcionalidade**: O que se ganha.

---

## Funcionalidades Recorrentes em Código: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js title="Ouvinte mínimo de clique"
document.querySelector('#salvar').addEventListener('click', (event) => {
  event.preventDefault();
  console.log('clicou em', event.currentTarget.id); // 'salvar'
});
```

---

## Executando

1. Entre na pasta do exemplo, em `examples/courses/web-api/common-features/`.
2. Sirva a pasta por HTTP, porque o `fetch()` do JSON não funciona a partir de `file://`.
3. Abra o endereço informado. A primeira carga vem do arquivo JSON, e o parágrafo de status diz isso.
4. Envie o formulário vazio e observe a mensagem: ela foi escrita pelo navegador, não pela página.

---

## Executando: Comando

```bash
npx serve .
```

---

## Exercício Prático

1. Mostre o total investido, somando os valores e formatando com `toLocaleString`.
2. Acrescente um campo de busca que filtre a lista enquanto o usuário digita.
3. Impeça o cadastro de um nome já existente usando `setCustomValidity()`.
4. Adicione um botão que copie o resumo da carteira com a Clipboard API.
5. Faça a lista rolar até o item recém-adicionado com `scrollIntoView()`.

---

## Perguntas de revisão

1. Qual API sustenta praticamente todas as outras funcionalidades desta página?
2. Por que `IntersectionObserver` substituiu o ouvinte de `scroll` em rolagem infinita?
3. Onde deve ficar um token de sessão, e por quê?
4. O que a History API exige do servidor para funcionar?
5. O que a Constraint Validation API entrega que uma cadeia de `if` não entrega?

---

## Resumo do Tópico

- **O mapa por funcionalidade**: revise o papel desse eixo no uso da API.
- **Funcionalidades Recorrentes em Código**: revise o papel desse eixo no uso da API.
