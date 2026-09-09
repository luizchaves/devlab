// build-wasm.mjs — gera math.wasm a partir da estrutura descrita em math.wat.
//
// O projeto não depende de nenhum compilador instalado: este script escreve as
// seções do binário WebAssembly à mão, valida o resultado e confere fib() contra
// uma implementação equivalente em JavaScript.
//
//   node build-wasm.mjs math.wasm
//
// Com o wabt instalado, `wat2wasm math.wat -o math.wasm` produz um binário
// equivalente a partir do mesmo fonte.
import { writeFileSync } from 'node:fs';

const u = (...b) => Uint8Array.from(b.flat());
function uleb(n) { const o = []; do { let b = n & 0x7f; n >>>= 7; if (n) b |= 0x80; o.push(b); } while (n); return o; }
function section(id, payload) { return [id, ...uleb(payload.length), ...payload]; }
function vec(items) { return [...uleb(items.length), ...items.flat()]; }
const str = (s) => [...uleb(s.length), ...[...s].map((c) => c.charCodeAt(0))];

const I32 = 0x7f;

// (func (param i32 i32) (result i32))  e  (func (param i32) (result i32))
const types = vec([
  [0x60, ...vec([[I32], [I32]]), ...vec([[I32]])],
  [0x60, ...vec([[I32]]), ...vec([[I32]])],
]);

const funcs = vec([[0], [1]]); // add -> type 0, fib -> type 1

const exports_ = vec([
  [...str('add'), 0x00, 0],
  [...str('fib'), 0x00, 1],
]);

// add: local.get 0; local.get 1; i32.add; end
const addBody = [...vec([]), 0x20, 0, 0x20, 1, 0x6a, 0x0b];

// fib iterativo
const fibBody = [
  ...vec([[4, I32]]), // 4 locais i32: a=1, b=2, i=3, t=4
  0x41, 0x00, 0x21, 1,
  0x41, 0x01, 0x21, 2,
  0x41, 0x00, 0x21, 3,
  0x02, 0x40,
  0x03, 0x40,
  0x20, 3, 0x20, 0, 0x4e, 0x0d, 0x01,
  0x20, 1, 0x20, 2, 0x6a, 0x21, 4,
  0x20, 2, 0x21, 1,
  0x20, 4, 0x21, 2,
  0x20, 3, 0x41, 0x01, 0x6a, 0x21, 3,
  0x0c, 0x00,
  0x0b,
  0x0b,
  0x20, 1,
  0x0b,
];

const code = vec([
  [...uleb(addBody.length), ...addBody],
  [...uleb(fibBody.length), ...fibBody],
]);

const bytes = u(
  [0x00, 0x61, 0x73, 0x6d], [0x01, 0x00, 0x00, 0x00],
  section(1, types), section(3, funcs), section(7, exports_), section(10, code)
);

console.log('bytes:', bytes.length, 'valid:', WebAssembly.validate(bytes));
const { instance } = await WebAssembly.instantiate(bytes);
const { add, fib } = instance.exports;
const jsFib = (n) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t; } return a; };
console.log('add(2,3) =', add(2, 3));
let ok = true;
for (let n = 0; n <= 30; n++) if (fib(n) !== jsFib(n)) { ok = false; console.log('MISMATCH', n, fib(n), jsFib(n)); }
console.log('fib confere de 0 a 30:', ok, '| fib(30) =', fib(30));
writeFileSync(process.argv[2] ?? 'math.wasm', bytes);
