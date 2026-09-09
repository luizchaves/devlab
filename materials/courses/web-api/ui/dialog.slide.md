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
title: "Web APIs: Dialog API"
description: "Slides completos do tópico Web APIs: Dialog API."
---

<!-- _class: lead -->

# Web APIs: Dialog API

O que o navegador resolve por você? · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Diferenciar `show()` de `showModal()` pelo efeito no restante da página.
- Fechar um diálogo por `close()`, pela tecla `Esc` e por um formulário com `method="dialog"`.
- Recuperar a escolha do usuário em `dialog.returnValue`.
- Explicar o que o navegador entrega de graça (foco preso, `::backdrop`, `inert`) e que uma `div` improvisada não entrega.
- Reconhecer os casos em que um modal é a solução errada e um aviso na própria página resolve melhor.

---

## Mapa do Tópico

- **O que o navegador resolve por você?**.
- **Modelo da API**.
- **Exemplo com preview e código**.
- **Cuidados práticos**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O que o navegador resolve por você?

Antes do `<dialog>`, um modal era uma `div` posicionada por CSS.

- **Camada acima de todo o resto**: Camada superior (*top layer*) do navegador.
- **Fundo escurecido**: Pseudoelemento `::backdrop`.
- **Restante da página inerte**: Automático enquanto o modal está aberto.
- **Fechar com `Esc`**: Nativo, com o evento `cancel`.
- **Foco preso na janela**: Nativo.

---

## O que o navegador resolve por você?: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
openButton.addEventListener('click', () => dialog.showModal());

dialog.addEventListener('close', () => {
  console.log(dialog.returnValue); // 'confirmar' ou 'cancelar'
});
```

---

## Modelo da API

O diálogo faz parte do HTML, mas ganha comportamento por JavaScript.

- **`<script>`**: Elemento HTML que representa a janela de diálogo.
- **`dialog.show()`**: Abre sem bloquear interação com o restante da página.
- **`dialog.showModal()`**: Abre como modal e torna o restante da página inerte.
- **`dialog.close(valor)`**: Fecha o diálogo e pode registrar um valor de retorno.
- **`method="dialog"`**: Permite fechar o diálogo pelo envio de um formulário interno.

---

## Exemplo com preview e código

O exemplo importado mostra abertura, fechamento e manipulação do conteúdo de um diálogo nativo.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/dom.
- html" height="20rem" label="dom.
- <SourceCode path="examples/courses/web-api/browser-web-apis/dom.

---

## Cuidados práticos

Nem todo modal precisa ser modal de verdade.

- **Confirmação destrutiva**: Texto claro, botão de cancelar visível e foco previsível.
- **Formulário dentro do diálogo**: Use `method="dialog"` quando o envio não depende de servidor.
- **Fechar com teclado**: Trate o evento `cancel` se `Esc` não puder fechar naquele caso.
- **Valor escolhido**: Leia `dialog.returnValue` no evento `close`.

---

## Quando usar, e quando não usar?

Um modal interrompe o que o usuário estava fazendo, e essa interrupção só se justifica.

- **Confirmar uma ação destrutiva**: A decisão é binária e precisa da atenção do usuário.
- **Editar dois ou três campos de um item da lista**: O contexto da lista continua visível ao fechar.
- **Cadastro longo, com muitos campos e validação**: O modal ficaria com rolagem interna e URL não compartilhável.
- **Painel que o usuário consulta enquanto trabalha**: Abre sem tornar o restante inerte.
- **Mensagem de sucesso ou erro após uma ação**: Não exige decisão, então não deve bloquear nada.

---

## Executando

1. Abra o preview ou o arquivo `dom.html` em uma aba própria.
2. Clique no botão que abre o diálogo.
3. Feche o diálogo pelo botão principal, pelo botão de cancelar e pelo teclado.
4. Observe no código onde `showModal()`, `close()` e os listeners são registrados.

---

## Exercício Prático

1. Adicione um segundo botão que abra o mesmo diálogo com uma mensagem diferente.
2. Registre no console o valor final de `dialog.returnValue`.
3. Crie uma validação que impeça o fechamento quando uma escolha obrigatória estiver vazia.

---

## Perguntas de revisão

1. Qual a diferença entre `show()` e `showModal()`?
2. Como um formulário dentro do diálogo o fecha sem JavaScript?
3. De onde vem o valor lido em `dialog.returnValue`?
4. Como impedir que `Esc` feche o diálogo em um estado específico?
5. O que o `<script>` entrega de acessibilidade que uma `div` posicionada não entrega?

---

## Resumo do Tópico

- **O que o navegador resolve por você?**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
