---
title: 'Web APIs: Catálogo de APIs do Navegador'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Catálogo de APIs do Navegador

## Ideia Central
- **Papel**: Catálogo e mapa de orientação das Web APIs abordadas no guia: Dialog, Canvas, Clipboard, Drag and Drop, Fullscreen, Geolocation, Fetch, Storage, Workers e mais
- **Contexto**: Os navegadores evoluíram de simples formatadores de hipertexto para ambientes de execução ricos, capazes de acessar hardware, gerenciar persistência local, capturar mídia, desenhar em alta taxa de quadros e comunicar-se em tempo real. As Web APIs são as interfaces padronizadas que o ambiente expõe para que o JavaScript interaja com todos esses recursos
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Mapa das APIs do Guia
- **Ideia**: Quando um script JavaScript é executado em um navegador, ele não roda isolado em uma máquina virtual pura
- **Detalhe**: O ambiente hospedeiro (*host environment*) injeta um conjunto extenso de objetos e métodos globais que permitem à aplicação interagir com a janela, ouvir ações do usuário, desenhar elementos gráficos, persistir dados localmente, comunicar-se com servidores remotos e até acessar recursos físicos do dispositivo
- **Ponto**: Ambiente e Interface: Controle de navegação SPA com a History API, modais acessíveis na camada superior com a Dialog API e imersão visual com a Fullscreen API
- **Ponto**: Estrutura DOM e Interatividade: Manipulação e criação dinâmica de nós HTML, delegação de eventos, validação com Constraint Validation API, rolagem suave e observadores assíncronos de visibilidade e redimensionamento
- **Ponto**: Desenho e Mídia: Renderização 2D direta em bitmap de alta performance com a Canvas API e recursos de síntese e reconhecimento de voz via Web Speech API
- **Ponto**: Entrada e Transferência: Acesso controlado à área de transferência com a Clipboard API e fluxos visuais de arrastar e soltar arquivos e elementos com a Drag and Drop API
### O Modelo de Sandbox e as Fronteiras com o Back-end
- **Ideia**: Ao navegar na web, o usuário carrega e executa código JavaScript de sites desconhecidos a cada página acessada
- **Ponto**: Acesso direto e irrestrito ao sistema de arquivos em disco: No navegador, scripts não podem ler pastas locais arbitrárias nem gravar arquivos silenciosamente sem o consentimento intencional do usuário (via `` ou diálogo de permissão). No back-end, ambientes como o Node.js utilizam os módulos nativos `node:fs` e `node:fs/promises` para ler e escrever arquivos, diretórios e logs no servidor com controle total de permissões do sistema operacional
- **Ponto**: Armazenamento de segredos e credenciais mestras: Chaves privadas de APIs externas (como Stripe, OpenAI e AWS), tokens administrativos e senhas de banco de dados nunca devem residir no front-end, onde ficam visíveis a qualquer pessoa pelo DevTools. No back-end, o Node.js lê variáveis de ambiente confidenciais de forma segura através de `process.env` e cofres de segredos (*Secret Managers*), sem expô-las ao cliente
### Segurança, Permissões e Níveis de Acesso
- **Ideia**: Para os recursos do dispositivo e do sistema que as Web APIs expõem com segurança, o navegador adota quatro camadas progressivas de proteção para evitar abusos por páginas maliciosas: Isolamento por Origem (*Same-Origin Policy*): Dados armazenados no `localStorage`, cookies e caches pertencem estritamente à combinação de protocolo, domínio e porta da aplicação
- **Ponto**: Isolamento por Origem (*Same-Origin Policy*): Dados armazenados no `localStorage`, cookies e caches pertencem estritamente à combinação de protocolo, domínio e porta da aplicação. Um site em `exemplo.com` não consegue ler dados de `outro-site.com`
- **Ponto**: Contexto Seguro (*Secure Context*): Recursos modernos e sensíveis (como Geolocation, Clipboard assíncrono, Web Workers compartilhados e Web Cryptography) só funcionam quando servidos sob HTTPS criptografado (ou em `localhost` durante o desenvolvimento)

## Catálogo de Web APIs do Guia
- **Ideia**: Cada cartão abaixo direciona para o tópico dedicado do guia, contendo fundamentação conceitual, boas práticas de segurança, exemplos interativos e exercícios práticos
- **Detalhe**: Não leia os cartões sequencialmente de ponta a ponta

## Qual API para qual problema?
- **Ideia**: O catálogo responde "o que existe"
- **Detalhe**: Esta seção responde a pergunta prática: dado um problema concreto, qual interface resolve, e qual alternativa costuma ser tentada incorretamente: O ecossistema do navegador também conta com interfaces avançadas para gráficos 3D (WebGL, WebGPU), bancos locais (IndexedDB), Service Workers offline, áudio modular (Web Audio), biometria (WebAuthn/Passkeys) e acesso a periféricos (Web Bluetooth/USB)

## Web APIs na Era da Inteligência Artificial
- **Ideia**: Pedir a um assistente "carregue os dados da API e mostre na tela" ou "copie este texto para a área de transferência" devolve, em segundos, um trecho que compila e executa
- **Detalhe**: Contudo, quase toda Web API tem comportamentos de borda que só aparecem fora do caminho feliz: As subseções a seguir mostram esse comportamento na prática e detalham o checklist essencial de revisão
- **Ponto**: Toda chamada `fetch()` valida `response.ok` antes de consumir o corpo da resposta?
- **Ponto**: Toda leitura de `localStorage` ou `sessionStorage` trata parsing de JSON e valor padrão?
- **Ponto**: Chamadas a APIs com permissão (Notificações, Câmera, Localização) partem exclusivamente de um gesto do usuário?
- **Ponto**: Toda Promise de Web API possui tratamento adequado de rejeição com retorno claro na interface?
### O erro que passa no caminho feliz
- **Ideia**: O pedido "escreva uma função que busca os itens da API e devolve os nomes" produz, com frequência, este código: Trecho de código real do projeto de exemplo, recortado na página do tópico
### Armadilhas Recorrentes por API
- **Ideia**: A tabela resume as omissões mais frequentes em código gerado por IA para Web APIs:
### Checklist de revisão antes do merge
- **Ideia**: Antes de aceitar trechos de Web APIs em sua aplicação, valide os seguintes pontos: Toda chamada `fetch()` valida `response
- **Ponto**: Toda chamada `fetch()` valida `response.ok` antes de consumir o corpo da resposta?
- **Ponto**: Toda leitura de `localStorage` ou `sessionStorage` trata parsing de JSON e valor padrão?

## Como estudar?
- **Ideia**: Para aproveitar o catálogo de APIs do guia com eficiência: Consulte o mapa de famílias para entender em qual domínio seu problema se enquadra
- **Detalhe**: Acesse a página da API correspondente e interaja com o preview executável
- **Ponto**: Consulte o mapa de famílias para entender em qual domínio seu problema se enquadra
- **Ponto**: Acesse a página da API correspondente e interaja com o preview executável
- **Ponto**: Inspecione o código-fonte real importado com `` e identifique os métodos nativos
- **Ponto**: Resolva os exercícios práticos propostos ao final de cada tópico antes de aplicar o padrão em projetos de produção

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
