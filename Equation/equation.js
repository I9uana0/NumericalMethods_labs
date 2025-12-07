// Функция уравнения
export function equation(x) {
  return 10 * Math.cos(x) - 0.1 * x * x;
}

export function derivativeEquation(x) {
  return -10 * Math.sin(x) - 0.2 * x;
}
