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
title: "Web APIs: Catálogo de APIs do Navegador"
description: "Slides completos do tópico Web APIs: Catálogo de APIs do Navegador."
---

<!-- _class: lead -->

# Web APIs: Catálogo de APIs do Navegador

Famílias de APIs · sandbox · permissões · escolha por problema · revisão

---

## Objetivo

- Agrupar Web APIs por **domínio funcional**.
- Explicar **sandbox**, origem, HTTPS, gesto e permissão.
- Escolher a API adequada para uma necessidade de front-end.
- Revisar código gerado por IA antes de aceitar o caminho feliz.

---

## Mapa do Tópico

- **Mapa das APIs**: famílias do navegador moderno.
- **Sandbox**: fronteiras entre front-end e back-end.
- **Permissões**: camadas de proteção progressivas.
- **Catálogo**: escolha por tarefa, não por moda.
- **IA**: revisão de erros comuns em Web APIs.

---

## Navegador Como Plataforma

O JavaScript recebe capacidades extras quando roda dentro da aba.

```txt
┌───────────── Navegador ─────────────┐
│ DOM     │ rede       │ storage      │
│ mídia   │ sensores   │ workers      │
│ eventos │ histórico  │ permissões   │
└─────────────────────────────────────┘
                ▲
                │ expõe interfaces globais
                │
          Código JavaScript
```

---

## Famílias do Catálogo

O guia organiza as interfaces por afinidade de uso.

| Família | APIs representativas |
| --- | --- |
| Ambiente e Interface | History, Dialog, Fullscreen |
| DOM e Interatividade | DOM, Events, Forms, Observers |
| Mídia e Entrada | Canvas, Web Speech, Clipboard, Drag and Drop |
| Dispositivo | Geolocation, Notification, Vibration |
| Rede e Dados | Storage, Cookies, Fetch, SSE, WebSockets |

---

## Sandbox do Navegador

O navegador executa código de sites desconhecidos dentro de uma caixa de proteção.

- Scripts não leem pastas locais arbitrárias.
- Segredos administrativos não ficam no front-end.
- Sockets TCP/UDP brutos pertencem ao back-end.
- Rotinas contínuas dependem da aba ou de infraestrutura específica.
- Bancos transacionais multiusuário ficam no servidor.

---

## Fronteira Front-end e Back-end

A página destaca o que a Web API não deve assumir como responsabilidade.

| Necessidade | No navegador | No back-end |
| --- | --- | --- |
| Arquivos | seleção intencional | `node:fs` |
| Segredos | nunca expor | `process.env` |
| Banco transacional | não resolver | ORM e banco ACID |
| Tarefas contínuas | aba pode suspender | filas, cron, serviços |

---

## SaaS e BaaS

Serviços em nuvem podem ser usados no front-end, mas não quebram o sandbox.

- Comunicação ocorre por HTTPS ou WebSockets, não por socket bruto.
- Chaves públicas precisam de escopo restrito.
- Tokens de sessão substituem credenciais mestras.
- Regras como RLS continuam sendo aplicadas no servidor.

---

## Camadas de Proteção

APIs sensíveis exigem barreiras progressivas contra abuso.

```txt
Same-Origin Policy
        │
        ▼
Secure Context (HTTPS ou localhost)
        │
        ▼
User Activation (clique, toque, tecla)
        │
        ▼
Permissions API (decisão explícita)
```

---

## Contexto Seguro e Gesto

Nem toda API basta existir no objeto global para poder ser usada.

- Clipboard assíncrono e geolocalização dependem de contexto seguro.
- Fullscreen, áudio e vibração costumam exigir ação do usuário.
- Notificações e localização abrem decisão explícita de permissão.
- Falha de permissão deve aparecer na interface, não só no console.

---

## Catálogo por Tarefa

Use o catálogo buscando a ação que a aplicação precisa executar.

| Tarefa | API indicada |
| --- | --- |
| confirmar ação | Dialog API |
| guardar preferência | Web Storage |
| guardar sessão | cookie `HttpOnly` |
| buscar dados | Fetch API |
| avisar fora da aba | Notification API |
| receber arquivo arrastado | Drag and Drop |

---

## Escolhas Que Evitam Armadilhas

A alternativa comum nem sempre preserva segurança, acessibilidade ou semântica.

| Necessidade | Evite |
| --- | --- |
| modal acessível | `div` com `z-index` manual |
| token de sessão | `localStorage` exposto a XSS |
| CORS | `mode: 'no-cors'` |
| texto dinâmico | `innerHTML` com dado externo |
| gráfico acessível | Canvas sem representação semântica |

---

## API Certa, Contexto Certo

Algumas escolhas dependem mais da intenção do que da disponibilidade técnica.

- Geolocation localiza pessoas, mas não escolhe idioma.
- Notification interrompe, aviso na página orienta sem invadir.
- Web Worker destrava a UI, WebAssembly acelera algoritmo.
- SVG é melhor para gráfico acessível; Canvas é melhor para muitos pixels.

---

## IA e Caminho Feliz

Código gerado por assistente costuma acertar a assinatura e esquecer o contrato.

| O modelo acerta | O revisor confere |
| --- | --- |
| chamada da API | erro, permissão e suporte |
| sintaxe básica | estados intermediários |
| teste manual feliz | falhas de rede e dados nulos |
| exemplo curto | segurança e feedback visual |

---

## Exemplo de Falha em Fetch

`fetch()` não rejeita a Promise quando o servidor responde `500`.

```js
const response = await fetch('/api/items');
const data = await response.json();

return data.map((item) => item.name);
```

**Risco**: um payload de erro pode virar `TypeError` longe da causa real.

---

## Contrato Corrigido

A página corrige o fluxo validando o status antes de ler o corpo.

```js
const response = await fetch('/api/items');

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const data = await response.json();
return data.map((item) => item.name);
```

---

## Armadilhas Recorrentes

Cada Web API tem uma falha previsível que precisa entrar na revisão.

| API | Omissão comum | Mitigação |
| --- | --- | --- |
| Storage | `JSON.parse()` direto | valor padrão e `try/catch` |
| Notification | pedir permissão no load | pedir após gesto |
| Clipboard | ignorar rejeição | feedback de sucesso/falha |
| Geolocation | só callback de sucesso | callback de erro e alternativa |

---

## Checklist Antes do Merge

Use a lista da página para revisar código de Web APIs em produção.

- `fetch()` valida `response.ok` antes de consumir JSON?
- Storage trata valor ausente e dado corrompido?
- APIs com permissão partem de gesto do usuário?
- Promises rejeitadas geram feedback visível?
- Dados externos evitam `innerHTML` vulnerável?
- O suporte nos navegadores-alvo foi confirmado?

---

## Como Estudar o Catálogo

A página recomenda navegação por problema, não leitura linear de cartões.

1. Identifique a família do problema.
2. Abra o tópico específico da API.
3. Interaja com o exemplo executável.
4. Leia o código real importado por `<SourceCode>`.
5. Resolva exercício e desafio antes de usar em produção.

---

## Perguntas de revisão

1. Por que o sandbox limita arquivos, segredos e sockets brutos?
2. Qual diferença prática existe entre contexto seguro e permissão?
3. Quando `localStorage` é pior que cookie `HttpOnly`?
4. Por que `mode: 'no-cors'` não resolve CORS?
5. O que revisar em código de Web API gerado por IA?

---

## Resumo do Tópico

- **Famílias**: escolha APIs por domínio e tarefa.
- **Sandbox**: front-end não substitui back-end.
- **Permissões**: origem, HTTPS, gesto e autorização importam.
- **Catálogo**: compare a solução indicada com alternativas ruins.
- **IA**: revise erro, permissão, suporte e segurança antes do merge.
