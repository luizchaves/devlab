import MathLib, { sum as add } from './lib.js'; // Especificador relativo
import { sqrt } from 'mathjs'; // Especificador de pacote

console.log(add(2, 1)); //=> 3
console.log(MathLib.subtract(2, 1)); //=> 1
console.log(sqrt(4)); //=> 2
