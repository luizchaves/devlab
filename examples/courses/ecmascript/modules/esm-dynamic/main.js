const needsCalculation = true;

if (needsCalculation) {
  // import() devolve uma Promise com o objeto de namespace do modulo
  const { sum, default: MathLib } = await import('./lib.js');

  console.log(sum(2, 1)); //=> 3
  console.log(MathLib.sum(2, 1)); //=> 3
}
