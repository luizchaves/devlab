import { divide, multiply, subtract, sum } from './lib.js';
// Alias local com "as"
import { sum as add } from './lib.js';

console.log(sum(2, 1)); //=> 3
console.log(subtract(2, 1)); //=> 1
console.log(multiply(2, 1)); //=> 2
console.log(divide(2, 1)); //=> 2

console.log(add(2, 1)); //=> 3
