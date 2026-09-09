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
title: "Web APIs: Geolocation API"
description: "Slides completos do tópico Web APIs: Geolocation API."
---

<!-- _class: lead -->

# Web APIs: Geolocation API

Uma resposta aproximada e opcional · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Solicitar uma posição com `getCurrentPosition()` e acompanhar mudanças com `watchPosition()`.
- Ler `coords.latitude`, `coords.longitude` e interpretar `coords.accuracy` como margem de erro.
- Tratar os códigos de `GeolocationPositionError` (permissão negada, indisponibilidade e *timeout*).
- Encerrar uma observação contínua com `clearWatch()` para não drenar bateria.
- Oferecer uma alternativa manual de endereço para o caso, comum, de permissão recusada.

---

## Mapa do Tópico

- **Uma resposta aproximada e opcional**.
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

## Uma resposta aproximada e opcional

Duas características separam a Geolocation API de quase tudo que o navegador oferece.

- **GPS do aparelho**: Celular ao ar livre.
- **Wi-Fi conhecido**: Celular ou notebook em área urbana.
- **Torre de celular**: Área sem Wi-Fi mapeado.
- **Endereço IP**: Computador de mesa com conexão fixa.

---

## Uma resposta aproximada e opcional: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    show(`${latitude}, ${longitude} (±${Math.round(accuracy)} m)`);
  },
  (error) => show(`Localização indisponível: ${error.message}`),
  { timeout: 10_000 }
);
```

---

## Modelo da API

A API fica.

- **`getCurrentPosition(success, error, options)`**: Solicita uma posição uma vez.
- **`watchPosition(success, error, options)`**: Observa mudanças de posição.
- **`clearWatch(id)`**: Cancela uma observação contínua.
- **`coords.latitude` e `coords.longitude`**: Coordenadas retornadas.
- **`coords.accuracy`**: Precisão aproximada em metros.

---

## Exemplo com preview e código

O exemplo importado mostra solicitação de localização e tratamento de erro quando a permissão é negada ou a posição não pode ser obtida.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/geolocation.
- html" height="20rem" label="geolocation.
- <SourceCode path="examples/courses/web-api/browser-web-apis/geolocation.

---

## Cuidados práticos

Localização pode falhar por decisão do usuário, bloqueio do navegador, ausência de sinal ou política de contexto seguro.

- **Usuário nega permissão**: Ofereça entrada manual de endereço.
- **Posição demora**: Configure `timeout`.
- **Precisão insuficiente**: Mostre a margem de erro ao usuário.
- **Observação contínua**: Use `clearWatch()` quando não precisar mais.

---

## Quando usar, e quando não usar?

Pedir localização tem um custo que não aparece no código: um usuário que recusa hoje continua recusando amanhã.

- **"Lojas perto de mim", após o clique no botão**: Pedir a posição no carregamento da página.
- **Preencher um endereço de entrega**: Coordenadas, que ainda precisariam virar endereço.
- **Navegação passo a passo em movimento**: Chamadas repetidas de `getCurrentPosition()`.
- **Conteúdo regional (idioma, moeda, fuso)**: Geolocalização, precisa demais para a finalidade.
- **Registrar por onde o usuário andou**: Coleta contínua, que é dado sensível.

---

## Executando

1. Abra o exemplo `geolocation.html` em uma aba própria.
2. Clique no botão de localização.
3. Aceite ou negue a permissão para comparar os dois fluxos.
4. Observe se o código mostra mensagem útil para sucesso e erro.

---

## Exercício Prático

1. Mostre a precisão (`coords.accuracy`) junto das coordenadas.
2. Adicione uma opção de fallback para o usuário digitar a cidade.
3. Configure um timeout de 10 segundos.

---

## Perguntas de revisão

1. Por que `coords.accuracy` deve aparecer na interface junto das coordenadas?
2. Por que a API usa callbacks em vez de devolver uma Promise?
3. Quais são os três desfechos possíveis do callback de erro?
4. O que a opção `timeout` controla?
5. O que acontece com um pedido recusado uma vez?

---

## Resumo do Tópico

- **Uma resposta aproximada e opcional**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
