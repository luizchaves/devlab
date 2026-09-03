// Desestruturacao do objeto devolvido por require()
const { sum, subtract, multiply, divide } = require('./lib.js');

console.log(sum(2, 1)); //=> 3
console.log(subtract(2, 1)); //=> 1
console.log(multiply(2, 1)); //=> 2
console.log(divide(2, 1)); //=> 2
