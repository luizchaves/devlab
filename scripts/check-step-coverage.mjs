#!/usr/bin/env node
/**
 * Cobertura do passo a passo das trilhas InvestApp e MonitorApp.
 *
 * As duas aplicações são cumulativas: cada etapa parte da anterior e acrescenta
 * uma camada. A pergunta que este script responde é se a página de cada etapa
 * dá conta do que aquela etapa realmente mudou no código — ou se o aluno que
 * seguir o passo a passo vai encontrar arquivos que nunca lhe foram mostrados.
 *
 * O critério tem duas metades:
 *
 *   1. EXIBIDA — para o código que o aluno escreve, as linhas que a etapa
 *      introduz ou altera precisam aparecer em um `<SourceCode>` ou `<CodeTabs>`
 *      da página daquela etapa.
 *
 *   2. DECLARADA — alguns arquivos mudam sem que ninguém os escreva à mão, e
 *      exibi-los seria ruído. Para esses, basta que a página cite o arquivo
 *      pelo nome, deixando claro que ele muda e por quê. Ver `ISENTOS`.
 *
 * Há ainda a válvula de escape, para arquivos repetitivos em que exibir tudo
 * ensina menos do que exibir um bloco representativo. A página declara o motivo
 * em um comentário MDX, que este script aceita e lista ao final:
 *
 *     {|* cobertura: src/docs/openapi.ts — os quatro caminhos repetem o
 *        formato do bloco acima *|}
 *
 * (troque `|` por `/` na sintaxe real). É uma exceção deliberada e greppável,
 * não um silêncio.
 *
 * A medição é sobre LINHAS ALTERADAS, não sobre o arquivo inteiro: um
 * `openapi.ts` de 400 linhas que muda dez precisa explicar dez, não 400. Um
 * arquivo renomeado ou movido é comparado com a sua origem, e não conta como
 * código novo.
 *
 *   node scripts/check-step-coverage.mjs
 *   node scripts/check-step-coverage.mjs --detalhe   (lista arquivo a arquivo)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROJETOS = 'examples/courses/express/projects';
const PAGINAS = 'src/content/docs/courses/expressjs/practice';

/** Fração mínima das linhas alteradas de um arquivo que a página precisa exibir. */
const MINIMO_EXIBIDO = 0.5;

/**
 * Mudança pequena o bastante para ser explicada em uma frase.
 *
 * Registrar um roteador no `index.ts` é uma linha; abrir um bloco de código só
 * para ela atrapalha mais do que ajuda. Até este tamanho, citar o arquivo pelo
 * nome no texto basta — acima dele, o código precisa aparecer.
 */
const LINHAS_DECLARAVEIS = 2;

/**
 * Arquivos cuja mudança basta ser declarada no texto.
 *
 * - migrations: geradas por `prisma migrate`, o aluno roda um comando;
 * - package.json: quase sempre versão de dependência, já coberta pelo
 *   `npm install` que a etapa mostra;
 * - arquivos ocultos (`.env`, `.dockerignore`): o `<SourceCode>` lê `examples/`
 *   por `import.meta.glob`, cujo padrão não alcança nomes iniciados por ponto —
 *   e o `.env` ainda é excluído de propósito, para não expor segredo. Exibi-los
 *   exigiria um bloco escrito à mão, que a regra 1 do AGENTS.md evita.
 */
const ISENTOS = [
  { padrao: /\/migrations\/.*\.(sql|toml)$/, rotulo: 'migration gerada' },
  { padrao: /(^|\/)package\.json$/, rotulo: 'package.json' },
  { padrao: /(^|\/)\.[^/]+$/, rotulo: 'arquivo oculto, fora do alcance do SourceCode' },
];

/** Nunca entram na conta: gerados, binários ou fora do assunto da aula (`.gitignore`). */
const IGNORADOS =
  /(^|\/)(package-lock\.json|app\.css|\.DS_Store|\.gitignore)$|\.(db|db-journal|log|png|jpe?g|gif|ico|webp|woff2?|ttf)$/;
const PASTAS_IGNORADAS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
  'generated',
]);

const TRILHAS = [
  {
    nome: 'InvestApp',
    paginas: 'investapp',
    etapas: [
      [1, 'front-static', 'invest-app-static'],
      [2, 'api', 'invest-app-api'],
      [3, 'typescript', 'invest-app-typescript'],
      [4, 'validation', 'invest-app-validation'],
      [5, 'swagger', 'invest-app-swagger'],
      [6, 'sqlite', 'invest-app-db-simple'],
      [7, 'prisma', 'invest-app-prismajs-relation'],
      [8, 'user', 'invest-app-prismajs-user'],
      [9, 'auth', 'invest-app-auth'],
      [10, 'email', 'invest-app-email'],
      [11, 'upload', 'invest-app-upload'],
      [12, 'testing', 'invest-app-test'],
    ],
  },
  {
    nome: 'MonitorApp',
    paginas: 'monitorapp',
    etapas: [
      [1, 'front-static', 'monitor-app-static'],
      [2, 'api', 'monitor-app-api'],
      [3, 'typescript', 'monitor-app-typescript'],
      [4, 'validation', 'monitor-app-validation'],
      [5, 'swagger', 'monitor-app-swagger'],
      [6, 'sqlite', 'monitor-app-db-simple'],
      [7, 'prisma', 'monitor-app-prisma'],
      [8, 'ping', 'monitor-app-ping'],
      [9, 'user', 'monitor-app-user'],
      [10, 'auth', 'monitor-app-auth'],
      [11, 'realtime', 'monitor-app-realtime'],
      [12, 'testing', 'monitor-app-test'],
    ],
  },
];

/** A etapa 13 (Docker) compartilha a pasta da 12, então as duas páginas contam juntas. */
const PAGINAS_EXTRA = { 12: ['docker'] };

const detalhado = process.argv.includes('--detalhe');

function listar(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    if (PASTAS_IGNORADAS.has(entrada.name)) return [];
    const alvo = join(dir, entrada.name);
    if (entrada.isDirectory()) return listar(alvo, base);
    const caminho = relative(base, alvo);
    return IGNORADOS.test(caminho) ? [] : [caminho];
  });
}

function ler(caminho) {
  try {
    return readFileSync(caminho, 'utf8');
  } catch {
    return null;
  }
}

/** Fração de linhas não vazias de `a` que também existem em `b`. */
function semelhanca(a, b) {
  const linhasA = a.split('\n').filter((l) => l.trim());
  if (!linhasA.length) return 0;
  const linhasB = new Set(b.split('\n'));
  return linhasA.filter((l) => linhasB.has(l)).length / linhasA.length;
}

const arquivoA = join(tmpdir(), 'devlab-cobertura-a');
const arquivoB = join(tmpdir(), 'devlab-cobertura-b');

/** Linhas do arquivo novo que o diff contra a origem marca como acrescentadas. */
function linhasAlteradas(origem, novo) {
  const linhas = (novo ?? '').split('\n');
  if (linhas.at(-1) === '') linhas.pop();
  if (origem === null) return new Set(linhas.map((_, i) => i + 1));

  writeFileSync(arquivoA, origem);
  writeFileSync(arquivoB, novo ?? '');
  let saida = '';
  try {
    execFileSync('diff', ['-u0', arquivoA, arquivoB]);
  } catch (erro) {
    saida = erro.stdout?.toString() ?? '';
  }
  const alteradas = new Set();
  for (const cabecalho of saida.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const inicio = Number(cabecalho[1]);
    const quantidade = cabecalho[2] === undefined ? 1 : Number(cabecalho[2]);
    for (let i = 0; i < quantidade; i++) alteradas.add(inicio + i);
  }
  return alteradas;
}

/** Faixa de uma regiao `#region nome` ... `#endregion`, 1-indexada e inclusiva. */
function faixaDaRegiao(texto, nome) {
  const linhas = texto.split('\n');
  let inicio = -1;
  for (const [i, linha] of linhas.entries()) {
    if (inicio === -1 && new RegExp(`#region\\s+${nome}\\b`).test(linha)) {
      inicio = i + 2;
      continue;
    }
    if (inicio !== -1 && /#endregion/.test(linha)) return [inicio, i];
  }
  return inicio === -1 ? null : [inicio, linhas.length];
}

/** Todos os `<SourceCode>` e `<CodeTabs>` de uma pagina. */
function blocosDaPagina(texto) {
  const blocos = [];
  for (const bloco of texto.matchAll(/<SourceCode\b([\s\S]*?)\/>/g)) {
    const atributos = bloco[1];
    const path = atributos.match(/path="([^"]+)"/)?.[1];
    if (path) {
      blocos.push({
        path,
        lines: atributos.match(/lines="([^"]+)"/)?.[1],
        region: atributos.match(/region="([^"]+)"/)?.[1],
      });
    }
  }
  for (const tabs of texto.matchAll(/<CodeTabs[\s\S]*?files=\{\[([\s\S]*?)\]\}/g)) {
    for (const item of tabs[1].split(/,(?![^{]*\})/)) {
      const path = item.match(/path:\s*'([^']+)'/)?.[1] ?? item.match(/^\s*'([^']+)'\s*$/)?.[1];
      if (path) {
        blocos.push({
          path,
          lines: item.match(/lines:\s*'([^']+)'/)?.[1],
          region: item.match(/region:\s*'([^']+)'/)?.[1],
        });
      }
    }
  }
  return blocos;
}

/** Linhas do arquivo que um bloco efetivamente coloca na tela. */
function linhasExibidas(bloco, total, conteudo) {
  const exibidas = new Set();
  const acrescentar = (de, ate) => {
    for (let i = de; i <= Math.min(ate, total); i++) exibidas.add(i);
  };

  if (bloco.region) {
    const faixa = faixaDaRegiao(conteudo, bloco.region);
    if (faixa) acrescentar(faixa[0], faixa[1]);
  } else if (bloco.lines) {
    for (const parte of bloco.lines.split(',')) {
      const numeros = parte.match(/\d+/g)?.map(Number) ?? [];
      if (numeros.length === 1) acrescentar(numeros[0], numeros[0]);
      else if (numeros.length >= 2) acrescentar(numeros[0], numeros[1]);
    }
  } else {
    acrescentar(1, total);
  }
  return exibidas;
}

function isencao(caminho) {
  return ISENTOS.find(({ padrao }) => padrao.test(caminho));
}

const problemas = [];
const excecoes = [];
const resumo = [];

for (const trilha of TRILHAS) {
  let totalAlteradas = 0;
  let totalExibidas = 0;

  for (const [indice, [numero, slug, pasta]] of trilha.etapas.entries()) {
    const dir = join(projectRoot, PROJETOS, pasta);
    const anterior =
      indice === 0 ? null : join(projectRoot, PROJETOS, trilha.etapas[indice - 1][2]);
    const arquivos = listar(dir);
    const doAnterior = anterior ? new Set(listar(anterior)) : new Set();

    let pagina = ler(join(projectRoot, PAGINAS, trilha.paginas, `${slug}.mdx`)) ?? '';
    for (const extra of PAGINAS_EXTRA[numero] ?? []) {
      pagina += `\n${ler(join(projectRoot, PAGINAS, trilha.paginas, `${extra}.mdx`)) ?? ''}`;
    }
    const blocos = blocosDaPagina(pagina);

    // Exceções declaradas na própria página, com o motivo por extenso.
    const declaracoes = new Map();
    for (const anotacao of pagina.matchAll(
      /\{\/\*\s*cobertura:\s*([^\s—-]+)\s*[—-]\s*([\s\S]*?)\*\/\}/g
    )) {
      declaracoes.set(anotacao[1].trim(), anotacao[2].replace(/\s+/g, ' ').trim());
    }

    // Um arquivo movido ou renomeado nao e codigo novo: procuramos a origem.
    const removidos = anterior
      ? [...doAnterior].filter((a) => !arquivos.includes(a)).map((a) => [a, ler(join(anterior, a))])
      : [];

    function origemDe(caminho, conteudo) {
      if (doAnterior.has(caminho)) return ler(join(anterior, caminho));
      const nome = caminho.split('/').pop();
      let melhor = null;
      let maior = 0;
      for (const [removido, antigo] of removidos) {
        if (antigo === null) continue;
        const mesmoNome = removido.split('/').pop() === nome;
        const parecido = semelhanca(antigo, conteudo ?? '');
        if (((mesmoNome && parecido > 0.3) || parecido > 0.6) && parecido > maior) {
          melhor = antigo;
          maior = parecido;
        }
      }
      return melhor;
    }

    let alteradasEtapa = 0;
    let exibidasEtapa = 0;

    for (const arquivo of arquivos) {
      const conteudo = ler(join(dir, arquivo));
      const origem = origemDe(arquivo, conteudo);
      if (origem === conteudo) continue;

      const alteradas = linhasAlteradas(origem, conteudo);
      if (!alteradas.size) continue;

      const caminhoCompleto = `${PROJETOS}/${pasta}/${arquivo}`;
      const total = (conteudo ?? '').split('\n').length;
      const naTela = new Set();
      for (const bloco of blocos.filter((b) => b.path === caminhoCompleto)) {
        for (const linha of linhasExibidas(bloco, total, conteudo ?? '')) naTela.add(linha);
      }
      const cobertas = [...alteradas].filter((linha) => naTela.has(linha)).length;

      alteradasEtapa += alteradas.size;
      exibidasEtapa += cobertas;

      const isento = isencao(arquivo);
      const pequena = alteradas.size <= LINHAS_DECLARAVEIS;
      const nome = arquivo.split('/').pop();
      const citado = pagina.includes(arquivo) || pagina.includes(nome);

      if (isento || pequena) {
        if (!citado) {
          const motivo = isento
            ? `E um arquivo isento de exibicao (${isento.rotulo})`
            : 'A mudanca e pequena o bastante para uma frase';
          problemas.push(
            `${trilha.nome} etapa ${numero} (${slug}): \`${arquivo}\` muda ${alteradas.size} linha(s) e a pagina nao o menciona. ` +
              `${motivo}, mas precisa ser declarado.`
          );
        }
      } else if (cobertas / alteradas.size < MINIMO_EXIBIDO) {
        const declarado = declaracoes.get(arquivo);
        if (declarado) {
          excecoes.push(`${trilha.nome} etapa ${numero}: ${arquivo} — ${declarado}`);
        } else {
          problemas.push(
            `${trilha.nome} etapa ${numero} (${slug}): \`${arquivo}\` muda ${alteradas.size} linha(s) e a pagina exibe ${cobertas}.`
          );
        }
      }

      if (detalhado) {
        const marca = isento ? 'isento' : pequena ? 'declaravel' : `${cobertas}/${alteradas.size}`;
        console.log(`  ${trilha.nome} ${numero}. ${arquivo} — ${marca}`);
      }
    }

    totalAlteradas += alteradasEtapa;
    totalExibidas += exibidasEtapa;
    resumo.push({
      trilha: trilha.nome,
      etapa: `${numero}. ${slug}`,
      alteradas: alteradasEtapa,
      exibidas: exibidasEtapa,
    });
  }

  resumo.push({
    trilha: trilha.nome,
    etapa: 'TOTAL',
    alteradas: totalAlteradas,
    exibidas: totalExibidas,
  });
}

for (const linha of resumo) {
  const pct = linha.alteradas ? Math.round((linha.exibidas / linha.alteradas) * 100) : 100;
  const rotulo = `${linha.trilha} · ${linha.etapa}`.padEnd(32);
  console.log(
    `${rotulo} ${String(linha.exibidas).padStart(5)}/${String(linha.alteradas).padEnd(5)} ${pct}%`
  );
}

if (problemas.length) {
  console.error(`\n${problemas.length} arquivo(s) com mudanca nao explicada:\n`);
  for (const problema of problemas) console.error(`  - ${problema}`);
  console.error(
    '\nCada linha que uma etapa altera precisa ser exibida em um bloco de codigo da pagina ' +
      'daquela etapa, ou — para os arquivos isentos — citada pelo nome no texto.'
  );
  process.exit(1);
}

if (excecoes.length) {
  console.log(`\n${excecoes.length} excecao(oes) declarada(s) na propria pagina:\n`);
  for (const excecao of excecoes) console.log(`  - ${excecao}`);
}

console.log('\nToda mudanca de codigo das trilhas esta exibida ou declarada.');
