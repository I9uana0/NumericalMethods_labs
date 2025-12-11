const matrix = [
  [-5.87, -7.28, -3.15, -0.42],
  [6.43, -3.98, -7.55, -1.53],
  [0.93, 9.41, 0.35, -0.23],
  [-9.87, -0.09, 0.04, 9.96],
];

const vector = [25.1, 30.3, -44.6, 85.8];

const matrixInput = document.getElementById("matrixInput");
const vectorInput = document.getElementById("vectorInput");

matrixInput.value = JSON.stringify(matrix);
vectorInput.value = JSON.stringify(vector);

const resultSpan = document.getElementById("resultSpan");
const chartCanvas = document.getElementById("matrixChart");
let chart = null;
let chartExists = false;

function hasError() {
  return (
    resultSpan.textContent.toLowerCase().includes("неверный формат") ||
    resultSpan.textContent.toLowerCase().includes("размеры не совпадают")
  );
}

function gaussMethod(A, b) {
  const n = A.length;

  // расширенная матрица
  for (let i = 0; i < n; i++) {
    A[i] = [...A[i], b[i]];
  }

  // прямой ход
  for (let i = 0; i < n; i++) {
    // 1. поиск главного элемента
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    // 2. перестановка строк
    [A[i], A[maxRow]] = [A[maxRow], A[i]];

    // 3. нормализация строки
    let pivot = A[i][i];
    for (let j = i; j < n + 1; j++) {
      A[i][j] /= pivot;
    }

    // 4. зануление строк ниже
    for (let k = i + 1; k < n; k++) {
      let coeff = A[k][i];
      for (let j = i; j < n + 1; j++) {
        A[k][j] -= coeff * A[i][j];
      }
    }
  }

  // обратный ход
  let x = Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    x[i] = A[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= A[i][j] * x[j];
    }
  }

  return x;
}

function drawChart(values) {
  values = values.map(Number);

  if (values.some((v) => isNaN(v))) return;

  const labels = values.map((_, i) => `x${i + 1}`);

  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const padding = (maxY - minY) * 0.1;
  const minYRounded = Math.floor((minY - padding) / 5) * 5;
  const maxYRounded = Math.ceil((maxY + padding) / 5) * 5;

  if (!chart) {
    chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Решение системы",
            data: values,
            borderColor: "blue",
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 5,
          },
        ],
      },
      options: {
        scales: {
          y: { min: minYRounded, max: maxYRounded },
        },
      },
    });

    chartExists = true;
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.options.scales.y.min = minYRounded;
    chart.options.scales.y.max = maxYRounded;
    chart.update();
  }
}

function isNumber(value) {
  // сначала пробуем преобразовать в число
  const num = Number(value);
  // проверяем, что это действительно число и не NaN
  return !isNaN(num) && value.toString().trim() !== "";
}

function updateVisibility() {
  // если в span пусто — прячем
  if (!resultSpan.textContent.trim()) {
    resultSpan.style.display = "none";
  } else {
    resultSpan.style.display = "block";
  }

  // если нет данных для графика — скрываем
  if (!chartExists || hasError()) {
    // chartExists — флаг, который ты ставишь, когда создаёшь график
    chartCanvas.style.display = "none";
  } else {
    chartCanvas.style.display = "block";
  }
}

function handleSubmit(e) {
  e.preventDefault();

  let matrix, vector;

  try {
    matrix =
      matrixInput.value.trim() === "" ? [[]] : JSON.parse(matrixInput.value);
    vector =
      vectorInput.value.trim() === "" ? [] : JSON.parse(vectorInput.value);

    if (!Array.isArray(matrix) || !Array.isArray(vector)) throw new Error();
  } catch {
    resultSpan.innerHTML =
      "<p style='text-align:center'>Неверный формат данных</p>";

    if (chart) {
      chart.destroy();
      chart = null;
    }

    updateVisibility();
    return;
  }

  const n = matrix.length;
  if (
    !matrix.every((row) => Array.isArray(row) && row.length === n) ||
    vector.length !== n
  ) {
    resultSpan.innerHTML =
      "<p style='text-align:center'>Размеры не совпадают</p>";

    if (chart) chart.destroy();
    chart = null;

    updateVisibility();
    return;
  }

  // Преобразуем все элементы в числа
  matrix = matrix.map((row) => row.map(Number));
  vector = vector.map(Number);

  // Решаем систему
  const result = gaussMethod(matrix, vector).map((x) => x.toFixed(3));

  resultSpan.innerHTML = `<ul>${result
    .map((x, i) => `<li>x${i + 1} = ${x}</li>`)
    .join("")}</ul>`;

  drawChart(result);

  updateVisibility();
}

matrixForm.addEventListener("submit", handleSubmit);
