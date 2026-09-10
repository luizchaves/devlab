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
title: "Guia de Referência: Web APIs"
description: "Slides de referência rápida de todas as assinaturas, métodos e interfaces das Web APIs no navegador."
---

<!-- _class: lead -->

# Guia de Referência: Web APIs

Panorama de assinaturas e métodos essenciais da plataforma Web.

---

## Objetivo

- Fornecer consulta rápida para assinaturas do BOM, DOM, Eventos, Fetch e Storage.
- Catalogar opções de configuração e comportamentos síncronos/assíncronos.
- Diferenciar responsabilidades entre as famílias de APIs do navegador.

---

## Mapa do Guia

- **BOM e Globais**: `window`, `location`, `history`, `navigator`, `console`.
- **DOM**: seleção, criação, mutação, classes, atributos e geometria.
- **Eventos**: `EventTarget`, ciclo de vida, ponteiro e teclado.
- **Rede e HTTP**: `fetch()`, `Response`, `Request`, `AbortController`, `WebSocket`.
- **Persistência**: `localStorage`, `sessionStorage`, cookies e `IndexedDB`.
- **Observers e UI**: `IntersectionObserver`, `ResizeObserver`, `dialog` e tela cheia.
- **Mídia e Dispositivo**: Canvas 2D, Clipboard, Geolocation e Web Crypto.

---

## Legenda e Convenções

- **`param?`**: parâmetro opcional.
- **`options`**: objeto de configuração adicional.
- **`Promise<T>`**: método assíncrono que devolve promessa.
- **`void`**: método sem retorno útil (`undefined`).
- **`Síncrono`**: bloqueia a thread da página.
- **`Assíncrono`**: roda em segundo plano sem travar a interface.

---

## BOM: Window e Diálogos

```js
window.innerWidth; window.innerHeight; // dimensões do viewport (px)
window.open(url, target, features);    // abre nova aba ou janela
window.alert(msg);                     // alerta síncrono bloqueante
window.confirm(msg);                   // confirmação booleana
window.prompt(msg, default);           // entrada de texto síncrona
window.requestAnimationFrame(callback);// repintura no próximo quadro (60/120Hz)
window.getComputedStyle(element);      // estilos CSS finais calculados
window.matchMedia('(min-width: 768px)');// avaliação de Media Queries
```

---

## BOM: Location e History

```js
// Location (URL atual)
location.href = url;       // redireciona gravando entrada no histórico
location.assign(url);     // carrega URL na aba atual
location.replace(url);    // substitui entrada atual no histórico
location.reload();        // recarrega página

// History (Navegação SPA)
history.back(); history.forward(); history.go(-2);
history.pushState(state, '', url);    // altera URL sem recarregar
history.replaceState(state, '', url); // substitui estado da URL
```

---

## BOM: Navigator e Console

```js
// Navigator (Dispositivo e Recursos)
navigator.userAgent;      // identificador do navegador
navigator.onLine;        // estado de conexão de rede
navigator.clipboard;     // interface da área de transferência
navigator.vibrate(200);  // feedback tátil em dispositivos móveis

// Console (Diagnóstico)
console.log(...dados); console.error(...dados); console.warn(...dados);
console.dir(element);    // árvore interativa com propriedades e protótipos
console.table(usuarios); // tabela bidimensional de objetos/arrays
console.time('label'); console.timeEnd('label'); // cronômetro de precisão
```

---

## DOM: Seleção e Navegação

```js
// Seleção
document.getElementById('id');           // elemento único por ID
document.querySelector('.classe');       // primeiro nó que atende ao seletor CSS
document.querySelectorAll('button.btn'); // NodeList estática com todos os nós
element.closest('.card');                // ancestral mais próximo que atende

// Navegação
element.parentElement;                   // elemento pai
element.children;                        // apenas elementos filhos
element.firstElementChild;               // primeiro filho elemento
element.nextElementSibling;              // próximo irmão elemento
```

---

## DOM: Criação e Manipulação

```js
// Criação
const el = document.createElement('div');
const frag = document.createDocumentFragment();

// Inserção e Remoção
node.appendChild(child);
element.append(...nosOuTexto);       // insere ao final
element.prepend(...nosOuTexto);      // insere no início
element.before(...nosOuTexto);       // insere como irmão anterior
element.after(...nosOuTexto);        // insere como irmão posterior
element.remove();                    // remove o próprio elemento
element.insertAdjacentHTML('beforeend', '<p>Texto</p>');
```

---

## DOM: Conteúdo, Classes e Geometria

```js
// Conteúdo e Atributos
element.textContent = 'Texto puro';  // texto sem tags
element.innerHTML = '<b>HTML</b>';   // conteúdo HTML (cuidado com XSS)
element.setAttribute('aria-label', 'Fechar');
element.dataset.userId = '42';       // atributos data-user-id

// Classes (classList)
element.classList.add('ativo'); element.classList.remove('oculto');
element.classList.toggle('selecionado'); element.classList.contains('ativo');

// Geometria
const rect = element.getBoundingClientRect(); // { top, left, width, height }
element.scrollIntoView({ behavior: 'smooth' });
```

---

## Eventos e EventTarget

```js
// Registro e Descarte
target.addEventListener('click', handler, { capture: false, once: true });
target.removeEventListener('click', handler);
target.dispatchEvent(new CustomEvent('app:login', { detail: { userId: 1 } }));

// Objeto Event
event.type;                          // nome do evento ('click')
event.target;                        // elemento de origem disparador
event.currentTarget;                 // elemento com o ouvinte anexado
event.preventDefault();              // cancela comportamento padrão
event.stopPropagation();             // interrompe borbulhamento (bubbling)
```

---

## Formulários e Validação

```js
// FormData
const data = new FormData(formElement);
data.get('email'); data.getAll('hobbies');
data.append('avatar', fileInput.files[0]);

// Constraint Validation API
form.checkValidity();                // true se todos os campos são válidos
form.reportValidity();               // valida e exibe balões visuais nativos
input.validity.valueMissing;         // true se campo obrigatório está vazio
input.setCustomValidity('Mensagem'); // define erro customizado
```

---

## Fetch API e Requisições HTTP

```js
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Ana' }),
  signal: AbortSignal.timeout(5000), // cancelamento por timeout em 5s
});

response.ok;                         // true se status 200-299
response.status;                     // 200, 201, 404, 500
const dados = await response.json(); // parse do corpo como JSON
const texto = await response.text(); // leitura como texto puro
```

---

## URL, WebSocket e SSE

```js
// URL e Query String
const url = new URL('https://api.exemplo.com/busca?q=js&limite=10');
url.searchParams.get('q');           // 'js'
url.searchParams.set('page', '2');   // atualiza query string

// WebSocket (Tempo Real Bidirecional)
const ws = new WebSocket('wss://api.exemplo.com/ws');
ws.onmessage = (e) => console.log(e.data);
ws.send(JSON.stringify({ tipo: 'ping' }));

// Server-Sent Events (Fluxo Unidirecional)
const sse = new EventSource('/api/stream');
sse.onmessage = (e) => console.log(e.data);
```

---

## Armazenamento: Web Storage e Cookies

```js
// LocalStorage e SessionStorage (Chave/Valor síncrono)
localStorage.setItem('tema', 'dark');
const tema = localStorage.getItem('tema');
localStorage.removeItem('tema');
localStorage.clear();

// Cookies
document.cookie = 'token=xyz; Path=/; Secure; SameSite=Strict; Max-Age=3600';
console.log(document.cookie); // lista strings de pares acessíveis
```

---

## Observadores: Observers API

```js
// IntersectionObserver (Visibilidade de Elementos)
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visivel');
  });
}, { threshold: 0.5 });
io.observe(card);

// ResizeObserver (Mudança de Tamanho de Elementos)
const ro = new ResizeObserver((entries) => {
  console.log(entries[0].contentRect.width);
});
ro.observe(box);
```

---

## Interface do Usuário: Dialog e Tela Cheia

```js
// Dialog API (<dialog>)
dialog.showModal();                  // abre modal no top layer com backdrop
dialog.show();                       // abre em modo não modal
dialog.close('confirmado');          // fecha e preenche dialog.returnValue

// Fullscreen API
await element.requestFullscreen();   // entra em tela cheia
await document.exitFullscreen();     // sai da tela cheia
document.fullscreenElement;          // elemento ocupando tela cheia atual
```

---

## Mídia, Gráficos e Dispositivo

```js
// Canvas 2D
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0284c7';
ctx.fillRect(10, 10, 100, 100);

// Clipboard API
await navigator.clipboard.writeText('Texto copiado');
const texto = await navigator.clipboard.readText();

// Geolocation
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords.latitude, pos.coords.longitude)
);

// Web Crypto (UUID v4)
const uuid = crypto.randomUUID();
```

---

## Resumo do Guia

- **BOM**: controle da janela, histórico de navegação e diagnósticos.
- **DOM**: construção reativa da árvore e escuta de eventos.
- **Rede**: `fetch()` com `AbortSignal`, WebSockets e streams.
- **Armazenamento**: `localStorage` simples e `IndexedDB` estruturado.
- **Modernidade**: `dialog`, observers, canvas e Web Crypto nativos.
