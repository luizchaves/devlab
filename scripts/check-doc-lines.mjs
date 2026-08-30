#!/usr/bin/env node
/**
 * Confere as referencias de linha da documentacao contra o codigo real.
 *
 * As paginas de projeto citam o codigo por numero de linha ("o `create` da
 * linha 14"). Quando o arquivo de exemplo muda, essas citacoes silenciosamente
 * apontam para o lugar errado — o build continua passando, `astro check` passa,
 * e so quem le a pagina percebe.
 *
 * Sao duas verificacoes, com naturezas diferentes:
 *
 *   1. FAIXA (padrao, falha a execucao) — todo `mark`, `collapse` e `lines` de
 *      um `<SourceCode>` precisa caber no arquivo apontado por `path`. E uma
 *      checagem mecanica: ou o numero existe no arquivo, ou nao existe.
 *
 *   2. PROSA (`--prosa`, apenas informativo) — quando o texto cita
 *      `identificador` e "linha N" na mesma frase, tenta conferir se o
 *      identificador aparece mesmo naquela linha.
 *
 * A segunda e heuristica e gera falso positivo com frequencia: o portugues
 * escreve tanto "o `X` da linha N" quanto "as linhas N a M configuram o `X`", e
 * uma frase pode citar duas coisas diferentes ("rejeita com `400` (linhas 18 a
 * 20), gera o id com `randomUUID()`"). Alem disso, a prosa nem sempre fala do
 * bloco de codigo mais proximo. Por isso ela nao reprova nada — serve para uma
 * revisao manual periodica, nao para o CI.
 *
 *   node scripts/check-doc-lines.mjs
 *   node scripts/check-doc-lines.mjs --prosa
 */
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const PADRAO_DOCS = 'src/content/docs/courses/**/*.mdx';

const SOURCE_CODE = /<SourceCode\b([\s\S]*?)\/>/g;
const ATRIBUTO_FAIXA = /(mark|collapse|lines)="([^"]+)"/g;
const CITACAO = /`([^`\n]{4,60})`[^.;\n]{0,60}?\blinhas?\s+(\d+)(?:\s*(?:a|e|até)\s*(\d+))?/gi;

/** Tokens comuns demais para ancorar uma linha especifica. */
const RUIDO = new Set([
  'get',
  'post',
  'put',
  'delete',
  'read',
  'create',
  'update',
  'remove',
  'name',
  'value',
  'path',
  'params',
  'query',
  'body',
  'catch',
  'try',
  'error',
]);

/** Extensoes que aparecem na prosa como nome de arquivo, nao como identificador. */
const EXTENSOES = new Set(['js', 'ts', 'html', 'json', 'css', 'http', 'prisma', 'yaml', 'mjs']);

const comProsa = process.argv.includes('--prosa');

const erros = [];
const avisos = [];

function numerosDe(valor) {
  return valor.split(',').flatMap((parte) => {
    const encontrados = parte.match(/\d+/g);
    return encontrados ? [encontrados.map(Number)] : [];
  });
}

for await (const doc of glob(PADRAO_DOCS)) {
  const texto = readFileSync(doc, 'utf8');
  const blocos = [...texto.matchAll(SOURCE_CODE)];

  for (const [i, bloco] of blocos.entries()) {
    const attrs = bloco[1];
    const caminho = attrs.match(/path="([^"]+)"/)?.[1];
    if (!caminho) continue;

    let linhas;
    try {
      linhas = readFileSync(caminho, 'utf8').split('\n');
    } catch {
      erros.push(`${doc}: arquivo inexistente — ${caminho}`);
      continue;
    }

    // 1. As faixas precisam caber no arquivo.
    for (const [, atributo, valor] of attrs.matchAll(ATRIBUTO_FAIXA)) {
      for (const numeros of numerosDe(valor)) {
        if (numeros.some((n) => n < 1 || n > linhas.length)) {
          erros.push(
            `${doc}: ${caminho} — ${atributo}="${valor}" fora do arquivo (${linhas.length} linhas)`
          );
        }
      }
    }

    if (!comProsa) continue;

    // 2. Ancoras citadas na prosa que antecede o bloco.
    const anterior = i ? blocos[i - 1].index + blocos[i - 1][0].length : 0;
    const prosa = texto.slice(anterior, bloco.index);

    for (const [, bruto, de, ate] of prosa.matchAll(CITACAO)) {
      const alvo = bruto.trim().replace(/\(\)$/, '');
      if (RUIDO.has(alvo.toLowerCase()) || /^\d+$/.test(alvo)) continue;
      if (EXTENSOES.has(alvo.split('.').at(-1)?.toLowerCase())) continue;

      const onde = linhas.flatMap((l, j) => (l.includes(alvo) ? [j + 1] : []));
      if (onde.length === 0) continue; // referencia conceitual, nao posicional

      const inicio = Number(de);
      const fim = Number(ate ?? de);
      if (!onde.some((n) => n >= inicio && n <= fim)) {
        avisos.push(
          `${doc}: ${caminho} — "${alvo}" citado na linha ${de}${ate ? `-${ate}` : ''}, mas está em ${onde.slice(0, 4).join(', ')}`
        );
      }
    }
  }
}

for (const e of erros) console.error(e);

if (comProsa) {
  for (const a of avisos) console.warn(`aviso: ${a}`);
  console.warn(
    `\n${avisos.length} citação(ões) para revisar à mão (heurística, gera falso positivo).`
  );
}

if (erros.length > 0) {
  console.error(`\n${erros.length} referência(s) de linha fora do arquivo.`);
  process.exit(1);
}

console.log('Referências de linha da documentação cabem nos arquivos apontados.');
