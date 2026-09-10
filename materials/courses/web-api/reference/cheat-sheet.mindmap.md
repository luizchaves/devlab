---
title: 'Web APIs: Guia de Referência'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Guia de Referência

## Ideia Central
- **Papel**: Guia completo de referência rápida de todas as assinaturas, interfaces e métodos das Web APIs
- **Contexto**: Consulta rápida de métodos, propriedades e opções do BOM, DOM, Eventos, Fetch, Storage, Observers, UI, Mídia e Segurança no navegador
- **Ambiente**: Navegador web moderno, especificações W3C e WHATWG

## Browser Object Model (BOM)
- **Window**: `innerWidth`, `innerHeight`, `open()`, `alert()`, `confirm()`, `prompt()`, `requestAnimationFrame()`, `matchMedia()`
- **Location**: `href`, `protocol`, `host`, `pathname`, `search`, `hash`, `assign()`, `replace()`, `reload()`
- **History**: `length`, `state`, `back()`, `forward()`, `go()`, `pushState()`, `replaceState()`
- **Navigator**: `userAgent`, `language`, `onLine`, `clipboard`, `geolocation`, `vibrate()`, `share()`
- **Screen**: `width`, `height`, `availWidth`, `availHeight`, `orientation`
- **Console**: `log()`, `info()`, `warn()`, `error()`, `dir()`, `table()`, `time()`, `group()`, `assert()`

## Document Object Model (DOM)
- **Seleção**: `getElementById()`, `querySelector()`, `querySelectorAll()`, `closest()`, `matches()`
- **Criação e Inserção**: `createElement()`, `createDocumentFragment()`, `appendChild()`, `append()`, `prepend()`, `before()`, `after()`, `remove()`, `insertAdjacentHTML()`
- **Conteúdo e Atributos**: `textContent`, `innerHTML`, `getAttribute()`, `setAttribute()`, `dataset`, `classList` (`add`, `remove`, `toggle`, `contains`)
- **Geometria**: `getBoundingClientRect()`, `clientWidth`, `offsetWidth`, `scrollHeight`, `scrollIntoView()`

## Eventos e Interatividade
- **EventTarget**: `addEventListener()`, `removeEventListener()`, `dispatchEvent()`
- **Event / CustomEvent**: `type`, `target`, `currentTarget`, `preventDefault()`, `stopPropagation()`, `detail`
- **Ciclo de Vida e I/O**: `DOMContentLoaded`, `load`, `click`, `pointerdown`, `keydown`, `input`, `change`, `submit`

## Formulários e Validação
- **FormData**: `new FormData()`, `get()`, `getAll()`, `set()`, `append()`, `delete()`, `entries()`
- **Constraint Validation**: `checkValidity()`, `reportValidity()`, `validity`, `setCustomValidity()`

## Comunicação de Rede e HTTP
- **Fetch API**: `fetch(resource, options)`, `Response` (`ok`, `status`, `json()`, `text()`, `blob()`, `Response.json()`)
- **Controle e Requisições**: `Request`, `Headers`, `AbortController`, `AbortSignal.timeout()`
- **URLs**: `new URL()`, `URLSearchParams` (`get()`, `set()`, `append()`, `delete()`, `toString()`)
- **Tempo Real**: `WebSocket` (bidirecional), `EventSource` (SSE unidirecional)

## Armazenamento Client-Side
- **Web Storage**: `localStorage` e `sessionStorage` (`setItem`, `getItem`, `removeItem`, `clear`)
- **Cookies**: `document.cookie` com diretivas (`Path`, `Secure`, `SameSite`, `Max-Age`)
- **IndexedDB**: banco estruturado e transacional assíncrono com `indexedDB.open()`
- **StorageManager**: `navigator.storage.estimate()` e `navigator.storage.persist()`

## Observadores (Observers API)
- **IntersectionObserver**: visibilidade e *lazy loading* de elementos (`observe`, `unobserve`, `disconnect`)
- **ResizeObserver**: detecção de mudanças de dimensões em caixas de layout
- **MutationObserver**: monitoramento de alterações estruturais e atributos na árvore do DOM

## Interface do Usuário (UI)
- **Dialog API**: `<dialog>`, `showModal()`, `show()`, `close()`, `returnValue`
- **Fullscreen API**: `requestFullscreen()`, `exitFullscreen()`, `fullscreenElement`
- **Popover API**: `showPopover()`, `hidePopover()`, `togglePopover()`

## Desenho e Mídia
- **Canvas 2D**: `getContext('2d')`, `fillRect()`, `beginPath()`, `arc()`, `fill()`, `stroke()`, `drawImage()`
- **Gráficos 3D**: WebGL2 (`createShader`, `createBuffer`, `drawArrays`), WebGPU (`requestAdapter`, `requestDevice`)
- **MediaDevices**: `getUserMedia` (câmera/áudio), `getDisplayMedia` (tela), `enumerateDevices()`
- **Streaming de Vídeo**: `RTCPeerConnection` (WebRTC P2P), `MediaSource` (MSE adaptativo), `MediaRecorder`
- **Web Speech**: `SpeechRecognition` (voz para texto), `speechSynthesis.speak()` (texto para voz)

## Entrada, Dispositivo e Segurança
- **Área de Transferência e Drag & Drop**: `navigator.clipboard`, `DataTransfer`, `dropEffect`
- **Dispositivo**: `Geolocation`, `Notification`, `navigator.vibrate()`
- **Concorrência**: `Web Workers` com `new Worker()` e `postMessage()`
- **Web Crypto**: `crypto.randomUUID()`, `crypto.getRandomValues()`, `crypto.subtle` (hash, chaves, assinatura)
