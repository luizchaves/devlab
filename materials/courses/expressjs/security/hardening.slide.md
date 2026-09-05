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
title: "Express.js: Endurecimento"
description: "Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS, segredos e dependências."
---

<!-- _class: lead -->

# Express.js: Endurecimento

Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS, segredos e dependências.

---

## Objetivo

- Ao final você saberá aplicar os cabeçalhos de segurança que uma API deve enviar, limitar requisições e tamanho de corpo, reconhecer as injeções que...

---

## Mapa da Aula

- **Objetivo**
- **O que é preciso defender**
- **Cabeçalhos de segurança**
- **Limite de requisições**
- **Limite de tamanho do corpo**
- **As injeções que sobram**
- **Segredos e dependências**
- **A cadeia de defesa em `app.ts`**

---

## Contexto da Aula

- Autenticação e autorização respondem "quem é" e "o que pode".
- Sobram os ataques que não dependem de conta nenhuma: força bruta, injeção, corpo gigante, dependência comprometida. Esta aula trata deles.

---

## O que é preciso defender

- Nem toda defesa é sobre invasores sofisticados. As três categorias abaixo cobrem quase tudo que atinge uma API pequena:
- Nenhum item desta aula sozinho torna a API segura.
- O objetivo é que uma falha em uma camada não seja suficiente: princípio de defesa em profundidade.

---

## O que é preciso defender: Tabela

- Abuso de recurso: força bruta no login, upload de 2 GB | limites de taxa e de tamanho
- Injeção: SQL, comando de sistema, prototype pollution | parametrizar e nunca interpolar
- Configuração exposta: segredo no Git, stack trace na resposta | ambiente e tratamento de erro

---

## Cabeçalhos de segurança

- O Express envia por padrão um cabeçalho que só ajuda o atacante:
- Ele informa a tecnologia e a superfície de ataque. Remover é uma linha:
- Os demais cabeçalhos instruem o navegador a se proteger:
- Aplica um conjunto amplo de cabeçalhos com padrões seguros e acompanha as recomendações à medida que elas mudam.
- Numa API que só devolve JSON, os que realmente contam são `nosniff`, `HSTS` e a ausência do `X-Powered-By`.

---

## Cabeçalhos de segurança: Exemplo 1

```txt
X-Powered-By: Express
```

---

## Cabeçalhos de segurança: Exemplo 2

```ts
app.disable('x-powered-by');
```

---

## Limite de requisições

- Sem limite, a rota de login aceita milhares de tentativas por minuto: e a senha fraca de qualquer usuário cai.
- O limite é por janela de tempo e por chave:
- { "error": { "status": 429, "message": "Muitas requisições. Tente novamente em instantes." } }
- Com duas instâncias, cada uma conta separadamente: e o limite efetivo dobra.
- Em produção, o contador precisa ser compartilhado (Redis): é o que `express-rate-limit` faz com um *store* configurável.

---

## Limite de requisições: Exemplo 1

```ts
const acessos = new Map<string, { count: number; resetAt: number }>();
export function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const chave = req.ip ?? 'desconhecido';
    const agora = Date.now();
    const registro = acessos.get(chave);
    if (!registro || registro.resetAt < agora) {
      acessos.set(chave, { count: 1, resetAt: agora + windowMs });
      return next();
    }
    if (++registro.count > max) {
```

---

## Limite de requisições: Exemplo 2

```ts
// Limite geral, mais folgado.
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
// Limite específico e agressivo na rota de login.
app.use('/auth/signin', rateLimit({ windowMs: 15 * 60_000, max: 5 }));
```

---

## Limite de tamanho do corpo

- O corpo acima do limite gera um erro que precisa virar `413`:

---

## Limite de tamanho do corpo: Exemplo 1

```ts
app.use(express.json({ limit: '100kb' }));
```

---

## Limite de tamanho do corpo: Exemplo 2

```ts
// entity.too.large vem do body-parser, usado por express.json()
if ((error as { type?: string }).type === 'entity.too.large') {
  return res.status(413).json({ error: { status: 413, message: 'Corpo muito grande' } });
}
```

---

## As injeções que sobram

- Cada tipo de injeção tem a mesma raiz: dado do usuário virando código: e a mesma cura: separar dado de comando.
- Uma função de *merge* recursivo aplicada a `{"proto": {"isAdmin": true}}` altera o protótipo de `Object` e todo objeto do processo passa a ter `isAdmin`.
- Use `Object.create(null)`, recuse essas chaves ou valide o corpo com um schema: a validação com Zod descarta campos desconhecidos por construção.

---

## As injeções que sobram: Tabela

- SQL: consulta montada por concatenação | *statements* preparados (`?`)
- Comando de sistema: `exec('ping ' + host)` | `execFile` com array de argumentos
- Caminho de arquivo: `sendFile('./uploads/' + nome)` | resolver e conferir o diretório
- Prototype pollution: *merge* profundo de `req.body` | recusar `proto` e `constructor`
- XSS refletido: HTML montado com dado do usuário | escapar na renderização

---

## As injeções que sobram: Exemplo

```ts
// Interpola: `8.8.8.8; rm -rf /` vira dois comandos
exec(`ping -c 3 ${req.query.host}`);
// Argumentos separados: o valor nunca é interpretado pelo shell
execFile('ping', ['-c', '3', String(req.query.host)]);
```

---

## Segredos e dependências

- Os dois vetores que não dependem de código escrito por você:
- Cada pacote instalado é código de terceiros rodando com os privilégios do seu servidor.
- É parte do motivo pelo qual este guia mostra as versões nativas de hash, JWT, CORS e limite de requisições antes dos pacotes correspondentes.

---

## Segredos e dependências: Tabela

- Segredo em log: `console.log(req.body)` no login | redigir campos sensíveis
- Dependência com vulnerabilidade: `npm audit` acusa | atualizar; avaliar se o caminho é alcançável
- Dependência abandonada: sem publicação há anos | substituir antes de virar problema
- Instalação em CI: `npm install` altera o lockfile | usar `npm ci`

---

## Segredos e dependências: Exemplo

```bash
npm audit
npm audit fix
npm ci
```

---

## A cadeia de defesa em `app.ts`

- A ordem importa tanto quanto a presença: um limite registrado depois do router não protege o router.

---

## A cadeia de defesa em `app.ts`: Exemplo

```ts
const app = express();
app.disable('x-powered-by');
// 1. Cabeçalhos de segurança em toda resposta.
app.use(securityHeaders);
// 2. CORS antes das rotas, para responder o preflight.
app.use(cors);
// 3. Limite geral, antes de qualquer processamento caro.
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
// 4. Corpo com limite de tamanho.
```

---

## Exercício

- No projeto `express-auth`:
- Desabilite `x-powered-by` e confirme com `curl -I`.
- Implemente `securityHeaders` e verifique os cabeçalhos na resposta.
- Implemente `rateLimit` e aplique `max: 5` em `POST /auth/signin`.
- Faça seis tentativas de login com senha errada e confirme o `429` com `Retry-After`.

---

## Exercício: Exemplo 1

```bash
  for i in $(seq 1 6); do
    curl -s -o /dev/null -w "%{http_code}\n" \
      -X POST localhost:3000/auth/signin \
      -H 'Content-Type: application/json' \
      -d '{"email":"ana@example.com","password":"errada"}'
  done
```

---

## Desafio

- Faça o `rateLimit` usar o `userId` como chave em rotas autenticadas e o IP nas públicas.
- Discuta: por que limitar por IP na rota de login é insuficiente quando o ataque vem de uma botnet, e o que mais poderia ser usado como chave?

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Limites

- Por que a rota de login precisa de um limite mais agressivo que as demais?
- Porque é a única rota em que cada tentativa tem valor para o atacante: sem limite, a força bruta encontra senhas fracas em minutos.
- Nas demais rotas, o limite protege disponibilidade, não credencial.
- Qual o risco de um limite de corpo generoso?
- O processo carrega o corpo inteiro na memória antes de interpretá-lo: alguns `POST` grandes simultâneos derrubam o servidor sem nenhuma sofisticação.

---

## Injeção

- Qual a raiz comum de todas as injeções?
- Dado do usuário sendo interpretado como comando.
- A cura é sempre a mesma: enviar dado e comando por canais separados: parâmetros em SQL, array de argumentos em processos, escape na renderização.
- O que é prototype pollution e por que ela é específica de JavaScript?
- É alterar `Object.prototype` através de chaves como `proto` em um *merge* recursivo, fazendo todo objeto do processo herdar propriedades do atacante.

---

## Próxima aula

- Upload de Arquivo: receber arquivos sem abrir uma porta nova.

---

## Resumo da Aula

- **Express.js: Endurecimento** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
