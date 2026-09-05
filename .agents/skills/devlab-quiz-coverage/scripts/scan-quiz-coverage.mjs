#!/usr/bin/env node
/**
 * scan-quiz-coverage — cruza as questoes do BrainCheck com o conteudo do DevLab.
 *
 * Le as questoes em `<repo-de-questoes>/questions/*.yml`, extrai as tags
 * hierarquicas (`language/javascript/ecma/array/sort`) e procura, no conteudo do
 * DevLab, evidencia de que o assunto e ensinado em algum lugar.
 *
 * A busca e por PALAVRA-CHAVE derivada da tag, e por isso o resultado e uma
 * TRIAGEM, nao um veredito: cabe a quem revisa abrir a pagina apontada e decidir
 * se o assunto esta mesmo coberto, coberto pela metade ou ausente.
 *
 * Uso:
 *   node scan-quiz-coverage.mjs [--questions <caminho>] [--quiz <slug-da-turma>]
 *                               [--min <n>] [--json <arquivo>]
 *
 *   --questions  raiz do repositorio de questoes
 *                (padrao: ../brain-check-questions relativo ao DevLab, ou $BRAINCHECK_DIR)
 *   --quiz       limita a varredura as questoes usadas por uma turma de `quizzes/<slug>/`
 *   --min        so reporta tags com pelo menos N questoes (padrao: 1)
 *   --json       grava o relatorio completo em JSON, para uso posterior
 *
 * Saida: as tags sem evidencia no DevLab, agrupadas por familia, com a contagem
 * de questoes e um exemplo de titulo de questao para dar contexto.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const devlab = resolve(aqui, '../../../..');

const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : padrao;
};

const repoQuestoes = resolve(
  opcao(
    'questions',
    process.env.BRAINCHECK_DIR ?? resolve(devlab, '../../apps/brain-check-questions')
  )
);
const filtroQuiz = opcao('quiz', null);
const minimo = Number(opcao('min', '1'));
const saidaJson = opcao('json', null);

const dirQuestoes = join(repoQuestoes, 'questions');
if (!existsSync(dirQuestoes)) {
  console.error(`Nao encontrei ${dirQuestoes}. Use --questions <caminho do repositorio>.`);
  process.exit(2);
}

/** Le apenas os campos que interessam, sem depender de parser de YAML. */
function lerQuestao(arquivo) {
  const texto = readFileSync(arquivo, 'utf8');
  const linhas = texto.split('\n');
  const titulo = (texto.match(/^title:\s*"?(.+?)"?\s*$/m) ?? [])[1] ?? '';
  const nivel = (texto.match(/^level:\s*(\w+)/m) ?? [])[1] ?? '';
  const slug = (texto.match(/^slug:\s*"?(.+?)"?\s*$/m) ?? [])[1] ?? '';

  const tags = [];
  let dentro = false;
  for (const linha of linhas) {
    if (/^tags:\s*$/.test(linha)) {
      dentro = true;
      continue;
    }
    if (!dentro) continue;
    const item = linha.match(/^ {2}- (.+?)\s*$/);
    if (item) {
      tags.push(item[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    if (linha.trim() === '') continue;
    if (/^\S/.test(linha)) dentro = false;
  }

  return { arquivo, slug, titulo, nivel, tags };
}

let questoes = readdirSync(dirQuestoes)
  .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
  .map((f) => lerQuestao(join(dirQuestoes, f)));

if (filtroQuiz) {
  const dirQuiz = join(repoQuestoes, 'quizzes', filtroQuiz);
  if (!existsSync(dirQuiz)) {
    console.error(`Turma nao encontrada: ${dirQuiz}`);
    process.exit(2);
  }
  const usados = new Set();
  for (const f of readdirSync(dirQuiz).filter((f) => f.endsWith('.yml'))) {
    for (const m of readFileSync(join(dirQuiz, f), 'utf8').matchAll(/^ {4}slug:\s*(.+)$/gm)) {
      usados.add(m[1].trim());
    }
  }
  questoes = questoes.filter((q) => usados.has(q.slug));
}

/** Conteudo do DevLab, em minusculas, para a busca por evidencia. */
function carregarConteudo() {
  const raiz = join(devlab, 'src/content/docs/courses');
  const paginas = [];
  const andar = (dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const caminho = join(dir, entrada.name);
      if (entrada.isDirectory()) andar(caminho);
      else if (/\.mdx?$/.test(entrada.name)) {
        paginas.push({
          caminho: caminho.replace(`${raiz}/`, ''),
          texto: readFileSync(caminho, 'utf8').toLowerCase(),
        });
      }
    }
  };
  andar(raiz);
  return paginas;
}

const paginas = carregarConteudo();

/**
 * Traducoes recorrentes: as tags sao em ingles e o conteudo do DevLab e em
 * portugues. Acrescente aqui o que aparecer com frequencia nas revisoes.
 */
const ALIASES = {
  mutator: ['mutator', 'mutador'],
  accessor: ['accessor', 'acessor'],
  sparse: ['sparse', 'esparso'],
  immutability: ['imutabilidade', 'imutáve'],
  reassignment: ['reassocia', 'reatribui'],
  redeclaration: ['redeclara'],
  conversion: ['conversão', 'conversao', 'convert'],
  coercion: ['coerção', 'coercao'],
  associativity: ['associatividade'],
  exponentiation: ['exponenciação', 'exponenciacao', '**'],
  scope: ['escopo', 'scope'],
  inheritance: ['herança', 'heranca', 'extends'],
  properties: ['propriedade'],
  characteristics: ['característica', 'caracteristica'],
  destructuring: ['desestrutura', 'destructuring'],
  chaining: ['encadea', 'chaining'],
  loops: ['laço', 'laco', 'loop'],
  iteration: ['itera'],
  wrapper: ['wrapper', 'objeto envelope'],
  handler: ['handler', 'manipulador'],
  strict: ['estrit', 'strict'],
  dynamic: ['dinâmic', 'dinamic', 'dynamic'],
  implicit: ['implícit', 'implicit'],
  explicit: ['explícit', 'explicit'],
  unary: ['unário', 'unario', 'unary'],
  logical: ['lógic', 'logic'],
  nested: ['aninhad', 'nested'],
  labeled: ['rótulo', 'rotulo', 'label'],
  arguments: ['argumento'],
  rules: ['regra'],
};

const IGNORAR_TERMO = new Set(['vs', 'and', 'or', 'de', 'the', 'a', 'api', 'basic', 'basics']);

/**
 * Padroes de busca derivados da tag. Uma tag composta (`mutator-accessor`,
 * `null-undefined`) so e considerada coberta quando TODAS as suas partes
 * aparecem na mesma pagina; folhas curtas (`at`, `if`) sao procuradas como token
 * de codigo, para nao casar com "atributo" ou "informacao".
 */
function padroes(tag) {
  const partes = tag.split('/');
  const folha = partes.at(-1);
  const pai = partes.at(-2) ?? '';
  if (!folha) return [];

  const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const termosDaFolha = folha.split(/[-_]/).filter((t) => t && !IGNORAR_TERMO.has(t));

  if (termosDaFolha.length === 0) termosDaFolha.push(folha);

  // cada termo vira um conjunto de alternativas (ingles + portugues)
  const grupos = termosDaFolha.map((termo) => {
    const alternativas = ALIASES[termo] ?? [termo];
    if (termo.length <= 3) {
      return alternativas.flatMap((a) => [
        new RegExp(`\\.${escapar(a)}\\(`, 'i'),
        new RegExp(`\\b${escapar(a)}\\s*\\(`, 'i'),
        new RegExp(`\`[^\`]{0,40}\\b${escapar(a)}\\b[^\`]{0,40}\``, 'i'),
      ]);
    }
    return alternativas.map((a) => new RegExp(escapar(a), 'i'));
  });

  // contexto do pai entra como grupo opcional adicional
  if (pai && pai.length > 3 && !IGNORAR_TERMO.has(pai)) {
    grupos.push([new RegExp(escapar(ALIASES[pai]?.[0] ?? pai), 'i')]);
  }

  return grupos;
}

/** Uma pagina cobre a tag quando satisfaz TODOS os grupos de termos. */
function cobre(pagina, grupos) {
  if (grupos.length === 0) return false;
  return grupos.every((alternativas) => alternativas.some((re) => re.test(pagina.texto)));
}

const porTag = new Map();
for (const q of questoes) {
  for (const tag of q.tags) {
    if (!porTag.has(tag)) porTag.set(tag, { tag, questoes: [] });
    porTag.get(tag).questoes.push(q);
  }
}

const relatorio = [];
for (const { tag, questoes: qs } of porTag.values()) {
  if (qs.length < minimo) continue;
  const grupos = padroes(tag);
  const encontrados = paginas.filter((p) => cobre(p, grupos)).map((p) => p.caminho);
  relatorio.push({
    tag,
    questoes: qs.length,
    exemplo: qs[0].titulo,
    niveis: [...new Set(qs.map((q) => q.nivel))],
    paginas: encontrados.slice(0, 4),
    total_paginas: encontrados.length,
  });
}

relatorio.sort((a, b) => a.total_paginas - b.total_paginas || b.questoes - a.questoes);

const semEvidencia = relatorio.filter((r) => r.total_paginas === 0);
const fracas = relatorio.filter((r) => r.total_paginas > 0 && r.total_paginas <= 2);

console.log(`Questoes analisadas: ${questoes.length}${filtroQuiz ? ` (turma ${filtroQuiz})` : ''}`);
console.log(
  `Tags distintas: ${porTag.size} · sem evidencia: ${semEvidencia.length} · evidencia fraca: ${fracas.length}\n`
);

const porFamilia = new Map();
for (const r of semEvidencia) {
  const familia = r.tag.split('/').slice(0, 2).join('/');
  if (!porFamilia.has(familia)) porFamilia.set(familia, []);
  porFamilia.get(familia).push(r);
}

console.log('== SEM EVIDENCIA NO DEVLAB (candidatos a lacuna) ==\n');
for (const [familia, itens] of [...porFamilia.entries()].sort(
  (a, b) => b[1].length - a[1].length
)) {
  console.log(`  ${familia}  (${itens.length} tags)`);
  for (const r of itens.sort((a, b) => b.questoes - a.questoes)) {
    console.log(`    ${String(r.questoes).padStart(3)}q  ${r.tag}`);
    console.log(`          ex.: ${r.exemplo}`);
  }
  console.log('');
}

if (fracas.length > 0) {
  console.log('== EVIDENCIA FRACA (uma ou duas paginas citam o termo; confira se ensinam) ==\n');
  for (const r of fracas.sort((a, b) => b.questoes - a.questoes).slice(0, 30)) {
    console.log(`  ${String(r.questoes).padStart(3)}q  ${r.tag}  ->  ${r.paginas.join(', ')}`);
  }
  console.log('');
}

if (saidaJson) {
  writeFileSync(
    saidaJson,
    JSON.stringify({ questoes: questoes.length, quiz: filtroQuiz, relatorio }, null, 2)
  );
  console.log(`Relatorio completo em ${saidaJson}`);
}

console.log('Lembre-se: a busca e por palavra-chave. Antes de concluir que ha lacuna,');
console.log('abra a pagina candidata e confirme se o assunto e realmente ensinado.');
