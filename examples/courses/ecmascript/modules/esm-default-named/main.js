// Default e nomeados na mesma instrucao de import
import MathLib, { sum as add } from './lib.js';

console.log(MathLib.sum(2, 1)); //=> 3
console.log(add(2, 1)); //=> 3
