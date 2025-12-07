// ==========================
// 2. Метод Ньютона (касательных)
// ==========================
function derivativeEquation(x) {
  return -10 * Math.sin(x) - 0.2 * x;
}

function findRootNewton(
  initialGuess = 5,
  epsilon = 1e-6,
  maxIterations = 1000
) {
  let x = initialGuess;

  for (let i = 0; i < maxIterations; i++) {
    let nextX = x - equation(x) / derivativeEquation(x);
    if (Math.abs(nextX - x) < epsilon) return nextX;
    x = nextX;
  }

  throw new Error("Метод Ньютона не сошёлся");
}

// ==========================
// 3. Метод хорд (секущих)
// ==========================
function findRootSecant(x0 = 0, x1 = 10, epsilon = 1e-6, maxIterations = 1000) {
  for (let i = 0; i < maxIterations; i++) {
    const f0 = equation(x0);
    const f1 = equation(x1);
    const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);

    if (Math.abs(x2 - x1) < epsilon) return x2;

    x0 = x1;
    x1 = x2;
  }

  throw new Error("Метод хорд не сошёлся");
}

// ==========================
// Примеры использования
// ==========================
console.log("Половинное деление:", findRootBisection(0, 10));
console.log("Метод Ньютона:", findRootNewton());
console.log("Метод хорд:", findRootSecant());
