// 1. Метод половинного деления
function findRootBisection(a, b, epsilon = 1e-6) {
  if (equation(a) * equation(b) >= 0) {
    throw new Error("Нет смены знака на интервале [a, b]");
  }

  let left = a;
  let right = b;
  let midpoint;

  while (right - left > epsilon) {
    midpoint = (left + right) / 2;
    if (equation(left) * equation(midpoint) < 0) {
      right = midpoint;
    } else {
      left = midpoint;
    }
  }

  return (left + right) / 2;
}
