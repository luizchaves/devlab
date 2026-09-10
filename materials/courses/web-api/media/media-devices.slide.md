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
title: "Web APIs: MediaDevices e Captura de Mídia"
description: "Slides completos do tópico Web APIs: MediaDevices e Captura de Mídia."
---

<!-- _class: lead -->

# Web APIs: MediaDevices e Captura de Mídia

Fluxos de Mídia · Constraints · Captura com Canvas · Liberação de Hardware

---

## Objetivo

- Solicitar acesso à câmera e microfone com `navigator.mediaDevices.getUserMedia()`.
- Definir restrições de captura (*constraints*) de resolução e `facingMode`.
- Vincular fluxos de mídia (`MediaStream`) a elementos `<video>` com `srcObject`.
- Extrair fotos desenhando o quadro do vídeo em um `<canvas>` 2D.
- Tratar recusa de permissões e exceções de hardware (`NotAllowedError`, `NotFoundError`).
- Encerrar as faixas com `track.stop()`, liberando os recursos físicos do dispositivo.

---

## Mapa do Tópico

- **O Modelo de Fluxos de Mídia (MediaStream)**.
- **Solicitando Permissões e Restrições (Constraints)**.
- **Contexto Seguro e Tratamento de Erros**.
- **Captura de Fotos com Canvas**.
- **Gerenciamento de Recursos e Encerramento de Faixas**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: capture áudio e vídeo sem plugins externos ou players legados.
- **Privacidade e segurança**: acesso explícito concedido pelo usuário e restrito a HTTPS.
- **Interatividade em tempo real**: base para leitores de QR Code, videoconferências e filtros.

*Regra de ouro: sempre encerre as faixas com track.stop() para liberar o hardware.*

---

## O Modelo de Fluxos de Mídia

A captura baseia-se em fluxos contínuos de dados gerados pelos sensores de hardware:

- **`MediaStream`**: contêiner agrupador de faixas multimídia ativas.
- **`MediaStreamTrack`**: cada faixa individual de vídeo ou de áudio.
- **Consumo no DOM**: o stream é atribuído diretamente a `video.srcObject`.

---

## Solicitação de Fluxo com Constraints

O método `getUserMedia()` recebe preferências de resolução e câmera:

```js
const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user', // 'user' (frontal) ou 'environment' (traseira)
  },
  audio: false,
};

const stream = await navigator.mediaDevices.getUserMedia(constraints);
const video = document.querySelector('video');
video.srcObject = stream;
```

---

## Contexto Seguro e Tratamento de Erros

A API só existe sob **HTTPS** ou `localhost`. Exceções comuns:

- **`NotAllowedError`**: usuário recusou a permissão ou câmera bloqueada no SO.
- **`NotFoundError`**: nenhum sensor compatível conectado.
- **`NotReadableError`**: câmera já em uso por outro aplicativo.
- **`OverconstrainedError`**: restrições impossíveis de atender pelo sensor.

---

## Captura de Fotos com Canvas

Renderize o quadro atual do vídeo em um elemento canvas para gerar imagens:

```js
function capturarFoto(video, canvas) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.9);
}
```

---

## Encerramento de Faixas (track.stop)

Apenas ocultar o `<video>` não desliga a câmera física:

```js
function desligarCamera(stream, video) {
  // Encerra cada faixa para desligar o LED e liberar o hardware
  stream.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
}
```

- Libera o sensor de câmera para outros apps.
- Economiza bateria e CPU do dispositivo.

---

## Quando usar, e quando não usar?

Escolha a ferramenta certa para a necessidade da aplicação:

- **Leitura de QR Code ou escaneamento contínuo**: `getUserMedia()`.
- **Upload simples de foto de perfil**: `<input type="file" capture="user">`.
- **Gravação de áudio/vídeo**: `MediaRecorder` em conjunto com `MediaStream`.
- **Captura de tela**: `navigator.mediaDevices.getDisplayMedia()`.

---

## Cuidados Práticos

- **Permissão por gesto**: chame `getUserMedia` apenas no clique do botão.
- **Tags no vídeo móvel**: use `autoplay playsinline muted` no `<video>`.
- **Desmontagem**: execute `track.stop()` no fechamento de modais ou rotas.

---

## Exercício Prático

1. Obtenha a resolução real da câmera lendo `video.videoWidth` e `video.videoHeight`.
2. Alterne a propriedade `audioTrack.enabled` para silenciar o microfone.
3. Trate a exceção `NotAllowedError` com uma mensagem amigável na interface.

---

## Perguntas de Revisão

1. Qual a diferença entre `MediaStream` e `MediaStreamTrack`?
2. Por que `getUserMedia` exige conexão HTTPS?
3. O que acontece se removermos o `<video>` sem chamar `track.stop()`?
4. Em qual situação `<input type="file" capture>` é preferível a `getUserMedia`?

---

## Resumo do Tópico

- **MediaDevices e getUserMedia**: acesso moderno e nativo a áudio e vídeo.
- **Constraints flexíveis**: especifique resoluções ideais e orientações de câmera.
- **Canvas snapshot**: captura instantânea de quadros com `drawImage()`.
- **Limpeza de hardware**: encerramento obrigatório com `track.stop()`.
