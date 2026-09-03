import { count, increment } from './counter.js';
import { count as countRef } from './counter.js';

console.log(count); //=> 0

increment();

console.log(count); //=> 1 (vinculo vivo: reflete a mutacao feita por increment())
console.log(countRef); //=> 1 (mesma referencia do modulo)
