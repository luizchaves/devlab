;; math.wat — fonte legível do módulo compilado em math.wasm
;;
;; O formato de texto (WAT) existe para leitura e depuração: o que o navegador
;; carrega é sempre o binário .wasm. Cada função abaixo é exportada pelo nome
;; usado no JavaScript em `instance.exports`.
(module
  ;; add(a, b) — soma dois inteiros de 32 bits.
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  ;; fib(n) — n-ésimo número de Fibonacci, calculado por iteração.
  ;; a = 0, b = 1; repete n vezes: t = a + b; a = b; b = t; devolve a.
  (func $fib (param $n i32) (result i32)
    (local $a i32) (local $b i32) (local $i i32) (local $t i32)
    i32.const 0
    local.set $a
    i32.const 1
    local.set $b
    i32.const 0
    local.set $i
    (block $done
      (loop $cont
        local.get $i
        local.get $n
        i32.ge_s
        br_if $done
        local.get $a
        local.get $b
        i32.add
        local.set $t
        local.get $b
        local.set $a
        local.get $t
        local.set $b
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $cont))
    local.get $a)

  (export "add" (func $add))
  (export "fib" (func $fib)))
