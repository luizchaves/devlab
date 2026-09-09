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
title: "Web APIs: Vibration API"
description: "Slides completos do tópico Web APIs: Vibration API."
---

<!-- _class: lead -->

# Web APIs: Vibration API

O Método `navigator.vibrate` · Exemplos Práticos · Quando usar, e quando não usar?

---

## Objetivo

- Disparar um pulso único com `navigator.vibrate(duração)`.
- Descrever padrões alternados de vibração e pausa com um array de milissegundos.
- Cancelar uma vibração em andamento com `navigator.vibrate(0)`.
- Detectar a ausência de suporte antes de chamar o método, evitando erro em navegadores de desktop.
- Decidir quando o retorno tátil acrescenta informação e quando ele apenas incomoda o usuário.

---

## Mapa do Tópico

- **O Método `navigator.vibrate`**.
- **Exemplos Práticos**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Método `navigator.vibrate`

O acesso à Vibration API é feito diretamente através do método.

- **`navigator.vibrate(200)`**: Vibra continuamente por 200 milissegundos.
- **`navigator.vibrate([100, 50, 200])`**: Vibra por 100ms, pausa por 50ms e vibra por 200ms.
- **`navigator.vibrate(0)` ou**: Cancela imediatamente qualquer vibração em andamento.

---

## Exemplos Práticos

A aplicação da Vibration API varia desde pulsos rápidos de confirmação de interface até sequências complexas de alerta e jogos.

- Por motivos de segurança e prevenção de abusos, os navegadores modernos só permitem acionar.
- Computadores de mesa (desktops) sem motor de vibração ignoram a chamada silenciosamente retornando `false`.

---

## Exemplos Práticos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const botaoConfirmar = document.querySelector('#btn-confirmar');

botaoConfirmar.addEventListener('click', () => {
  // Verifica se o dispositivo suporta a API
  if ('vibrate' in navigator) {
    // Pulso rápido de 50ms para simular sensação de clique físico
    navigator.vibrate(50);
  }
  console.log('Ação confirmada!');
});
```

---

## Quando usar, e quando não usar?

A vibração é o único canal deste catálogo que o usuário sente sem ver e sem ouvir.

- **Confirmar um toque em um jogo ou teclado virtual**: Pulso longo, que é percebido como falha.
- **Sinalizar erro de leitura em um scanner de códig**: Alerta visual apenas, que exige olhar a tela.
- **Cronômetro ou temporizador que chegou ao fim**: Notificação, quando o usuário está com o aparelho na mão.
- **Chamar atenção para uma mensagem nova**: `vibrate()`, que só funciona com a página aberta.
- **Retorno de qualquer ação em navegador de mesa**: `vibrate()`, indisponível fora de aparelhos móveis.

---

## Executando

1. Acesse sua página web a partir de um smartphone com suporte a vibração.
2. Abra o console das ferramentas de desenvolvedor (<kbd>F12</kbd>).
3. Execute o comando: `document.body.addEventListener('click', () => navigator.vibrate([200, 100, 200]));`.
4. Toque em qualquer lugar da tela e sinta os dois pulsos de vibração.

---

## Exercício Prático

1. Escreva uma função `cancelarVibracao()` que interrompa imediatamente qualquer padrão de vibração em andamento no dispositivo.
2. Como verificar se o navegador do usuário possui suporte nativo à Vibration API antes de chamá-la?
3. O que acontece ao passar o array `[500, 200, 500]` para `navigator.vibrate()`?
4. Função de cancelamento.
5. Verificando a presença da propriedade na interface `navigator`.

---

## Desafio

Crie uma função `vibrarCodigoMorse(texto)` que converta a letra "S".

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. O método `navigator.vibrate()` exige HTTPS ou contexto seguro?
2. Como cancelar imediatamente uma sequência de vibração longa que ainda está em execução?

---

## Resumo do Tópico

- **O Método `navigator.vibrate`**: revise o papel desse eixo no uso da API.
- **Exemplos Práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
