#!/usr/bin/env node

/**
 * check-code-blocks — confere os blocos de codigo de uma pagina do DevLab.
 *
 * Duas camadas:
 *
 *   1. SINTAXE (padrao, sempre segura): cada bloco ```js / ```ts e escrito em um
 *      arquivo temporario e passa por `node --check`. Pega chave nao fechada,
 *      template literal aberto e sintaxe invalida que o build do site nao acusa,
 *      porque para o Astro o bloco e apenas texto.
 *
 *   2. EXECUCAO (`--run`, heuristica): blocos autocontidos sao executados com
 *      Node.js e a saida real e comparada com o que a pagina promete, tanto no
 *      bloco ```txt title="Output" seguinte quanto nos comentarios de saida
 *      escritos na propria linha (`console.log(x); // 22`).
 *
 * Uso:
 *   node scripts/check-code-blocks.mjs <arquivo.mdx> [--run] [--verbose]
 *   node scripts/check-code-blocks.mjs "src/content/docs/courses/ecmascript/**\/*.mdx"
 *
 * Saida: relatorio por bloco (OK / AVISO / ERRO) e codigo de saida 1 se houver ERRO.
 * Avisos nao quebram: a camada 2 e heuristica por natureza.
 */

import { execFileSync } from 'node:child_process';
import { globSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const run = args.includes('--run');
const verbose = args.includes('--verbose');
const patterns = args.filter((a) => !a.startsWith('--'));

if (patterns.length === 0) {
  console.error('uso: node check-code-blocks.mjs <arquivo.mdx|glob> [--run] [--verbose]');
  process.exit(2);
}

/** Linguagens que sabemos analisar. */
const JS_LANGS = new Set(['js', 'javascript', 'mjs', 'ts', 'typescript']);

/** Sinais de que o bloco nao roda sozinho no Node.js. */
const NAO_AUTOCONTIDO = [
  /^\s*import\s.+from\s+['"]\.\.?\//m, // import relativo de arquivo que nao existe aqui
  /\b(document|window|localStorage|alert|fetch\()/,
  /\bapp\.(use|get|post|put|delete|listen)\(/,
  /\bprisma\b|\bexpress\b|\breq\b|\bres\b/,
  /\.\.\./m, // reticencia literal de pseudocodigo
  /^\s*\/\/\s*(TODO|\.\.\.)/m,
];

/** Extrai os blocos cercados, preservando a linha inicial de cada um. */
function extrairBlocos(texto) {
  const linhas = texto.split('\n');
  const blocos = [];
  let atual = null;

  linhas.forEach((linha, i) => {
    const abre = linha.match(/^(\s*)```(\w+)?(.*)$/);

    if (atual === null && abre) {
      atual = {
        indent: abre[1].length,
        lang: (abre[2] || '').toLowerCase(),
        title: (abre[3].match(/title="([^"]*)"/) || [])[1] || null,
        linha: i + 1,
        corpo: [],
      };
      return;
    }

    if (atual !== null) {
      if (linha.trim() === '```' || /^\s*```\s*$/.test(linha)) {
        atual.codigo = atual.corpo.map((l) => l.slice(atual.indent)).join('\n');
        blocos.push(atual);
        atual = null;
        return;
      }
      atual.corpo.push(linha);
    }
  });

  return blocos;
}

/** Expectativas escritas como comentario na propria linha do console.log. */
function expectativasInline(codigo) {
  const esperado = [];

  for (const linha of codigo.split('\n')) {
    if (!/console\.(log|error|warn)\(/.test(linha)) continue;

    const comentario = linha.match(/\/\/\s*(.+)$/);
    if (!comentario) continue;

    const bruto = comentario[1].trim();

    // a pagina costuma anotar o valor e, entre parenteses, o motivo:
    // "false (um digito a menos)". As duas leituras sao aceitas.
    const formas = [bruto, bruto.split(' (')[0]].map((forma) => {
      let valor = forma.trim();
      // "texto" nas anotacoes marca que o retorno e string; o console nao imprime aspas
      if (/^"(.*)"$/.test(valor) || /^'(.*)'$/.test(valor)) valor = valor.slice(1, -1);
      // enfase didatica ("false!", "true.") nao faz parte da saida
      return valor.replace(/[!.]+$/, '').trim();
    });

    if (formas[0]) esperado.push([...new Set(formas)].filter(Boolean));
  }

  return esperado;
}

/** Aproxima a forma como a pagina escreve o valor da forma como o console imprime. */
function normalizarValor(texto) {
  return texto
    .replace(/'/g, '"')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .replace(/\{\s+/g, '{')
    .replace(/\s+\}/g, '}')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizar(texto) {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

const dir = mkdtempSync(join(tmpdir(), 'devlab-blocos-'));
let erros = 0;
let avisos = 0;
let conferidos = 0;

const arquivos = patterns.flatMap((p) => (p.includes('*') ? globSync(p) : [p]));

for (const arquivo of arquivos) {
  const texto = readFileSync(arquivo, 'utf8');
  const blocos = extrairBlocos(texto);
  const relato = [];

  blocos.forEach((bloco, indice) => {
    if (!JS_LANGS.has(bloco.lang)) return;
    if (!bloco.codigo || bloco.codigo.trim() === '') return;

    conferidos += 1;
    const rotulo = `${arquivo}:${bloco.linha}${bloco.title ? ` (${bloco.title})` : ''}`;

    // ---- camada 1: sintaxe -------------------------------------------------
    const temp = join(dir, `bloco-${indice}.mjs`);

    // um bloco pode reunir mais de um arquivo, separado por cabecalhos "// arquivo.js";
    // nesse caso cada parte e conferida isoladamente
    const cabecalhos = [...bloco.codigo.matchAll(/^\/\/\s*[\w./-]+\.(?:js|mjs|cjs|ts)\s*$/gm)];
    const multiArquivo = cabecalhos.length >= 2;
    const partes = multiArquivo
      ? bloco.codigo.split(/^\/\/\s*[\w./-]+\.(?:js|mjs|cjs|ts)\s*$/gm).filter((p) => p.trim())
      : [bloco.codigo];

    writeFileSync(temp, partes[0]);

    try {
      partes.forEach((parte, i) => {
        const alvo = join(dir, `bloco-${indice}-${i}.mjs`);
        writeFileSync(alvo, parte);
        execFileSync(process.execPath, ['--check', alvo], { stdio: 'pipe' });
      });
      writeFileSync(temp, bloco.codigo);
    } catch (erro) {
      const msg = String(erro.stderr || erro.message)
        .split('\n')
        .find((l) => /SyntaxError/.test(l));

      const linhas = bloco.codigo.trim().split('\n').length;
      const pareceAssinatura =
        /^(assinatura|sintaxe)/i.test(bloco.title ?? '') ||
        /\?[,)]/.test(bloco.codigo) || // parametro opcional na notacao de documentacao
        (linhas <= 8 && !/console\./.test(bloco.codigo) && !/;\s*$/m.test(bloco.codigo));

      // trecho de dentro de uma funcao, mostrado isolado de proposito
      if (
        /Illegal return statement|await is only valid|'super' keyword/.test(String(erro.stderr))
      ) {
        if (verbose)
          relato.push(
            `  PULADO ${rotulo}\n         fragmento: so faz sentido dentro de funcao ou classe`
          );
        return;
      }

      if (pareceAssinatura) {
        relato.push(
          `  AVISO  ${rotulo}\n         nao e JavaScript valido; se for assinatura ou pseudocodigo, marque o bloco como \`\`\`txt`
        );
        avisos += 1;
        return;
      }

      relato.push(
        `  ERRO   ${rotulo}\n         sintaxe invalida: ${msg ?? 'ver saida do node --check'}`
      );
      erros += 1;
      return;
    }

    if (!bloco.title) {
      relato.push(
        `  AVISO  ${rotulo}\n         bloco sem title="..." (obrigatorio pela skill de docs)`
      );
      avisos += 1;
    }

    if (!run) return;

    // ---- camada 2: execucao ------------------------------------------------
    if (multiArquivo) {
      if (verbose) relato.push(`  PULADO ${rotulo}\n         bloco reune mais de um arquivo`);
      return;
    }

    if (NAO_AUTOCONTIDO.some((re) => re.test(bloco.codigo))) {
      if (verbose)
        relato.push(
          `  PULADO ${rotulo}\n         nao autocontido (import relativo, API de navegador ou pseudocodigo)`
        );
      return;
    }

    let saida;
    try {
      saida = execFileSync(process.execPath, [temp], {
        stdio: 'pipe',
        timeout: 10_000,
        encoding: 'utf8',
      });
    } catch (erro) {
      const stderr = String(erro.stderr || '');
      // erro lancado de proposito pelo exemplo continua sendo saida valida
      if (/ReferenceError: (\w+) is not defined/.test(stderr)) {
        if (verbose)
          relato.push(`  PULADO ${rotulo}\n         depende de simbolo definido em outro bloco`);
        return;
      }
      relato.push(
        `  AVISO  ${rotulo}\n         o bloco nao executa ate o fim: ${stderr.split('\n').find(Boolean) ?? erro.message}\n` +
          `         (se o erro e proposital, ignore; se nao, o exemplo esta quebrado)`
      );
      avisos += 1;
      return;
    }

    const linhasSaida = normalizar(saida).split('\n').filter(Boolean);

    // compara com o bloco ```txt title="Output" imediatamente seguinte
    const proximo = blocos[indice + 1];
    if (proximo && proximo.lang === 'txt' && /output/i.test(proximo.title ?? '')) {
      if (normalizar(saida) !== normalizar(proximo.codigo)) {
        relato.push(
          `  AVISO  ${rotulo}\n         a saida real difere do bloco Output da linha ${proximo.linha}\n` +
            `         real:     ${JSON.stringify(normalizar(saida).slice(0, 120))}\n` +
            `         na pagina:${JSON.stringify(normalizar(proximo.codigo).slice(0, 120))}`
        );
        avisos += 1;
      }
      return;
    }

    // compara com os comentarios de saida escritos na propria linha
    // em codigo assincrono a saida nao sai na ordem das linhas: comparar por
    // posicao produziria ruido, entao a conferencia fica com o bloco Output
    if (/\bawait\b|\.then\(|setTimeout\(|setInterval\(/.test(bloco.codigo)) return;

    const esperado = expectativasInline(bloco.codigo);
    if (esperado.length === 0) return;

    // comparacao por presenca, e nao por posicao: um console.log em varias linhas
    // ou uma saida com mais linhas que anotacoes deslocaria todo o pareamento
    const saidaNormalizada = linhasSaida.map(normalizarValor);

    esperado.forEach((formas) => {
      const casou = formas.some((valor) => {
        const alvo = normalizarValor(valor);
        return saidaNormalizada.some((linha) => linha === alvo || linha.startsWith(alvo));
      });
      if (casou) return;

      // comentario explicativo em texto corrido nao e promessa de saida
      const principal = formas[0];
      const pareceValor =
        /^[[{"'\d-]/.test(principal) ||
        /^(true|false|null|undefined|NaN|Infinity)\b/.test(principal) ||
        !/\s/.test(principal);
      if (!pareceValor) return;

      relato.push(
        `  AVISO  ${rotulo}\n         comentario promete ${JSON.stringify(principal)}, ausente na saida real\n` +
          `         saida: ${JSON.stringify(linhasSaida.slice(0, 4).join(' | ').slice(0, 120))}`
      );
      avisos += 1;
    });
  });

  if (relato.length > 0) {
    console.log(`\n${arquivo}`);
    console.log(relato.join('\n'));
  }
}

rmSync(dir, { recursive: true, force: true });

console.log(
  `\n${conferidos} bloco(s) de codigo conferido(s) · ${erros} erro(s) · ${avisos} aviso(s)` +
    (run ? '' : ' · execucao desligada (use --run)')
);

process.exit(erros > 0 ? 1 : 0);
