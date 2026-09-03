// Todo o modulo em um unico objeto de namespace
import * as Lib from './lib.js';

console.log(Lib.sum(2, 1)); //=> 3
console.log(Lib.PI); //=> 3.14
console.log(Lib.default.PI); //=> 3.14
console.log(Object.keys(Lib)); //=> [ 'PI', 'default', 'sum' ]
