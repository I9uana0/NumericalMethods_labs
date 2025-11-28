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

let chart = null;

function drawChart(values) {
  // Преобразуем строки в числа, если вдруг остались
  values = values.map(Number);

  // Проверка на NaN
  if (values.some((v) => isNaN(v))) return;

  const labels = values.map((_, i) => `x${i + 1}`);

  // находим min и max
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const padding = (maxY - minY) * 0.1;
  const minYRounded = Math.floor((minY - padding) / 5) * 5;
  const maxYRounded = Math.ceil((maxY + padding) / 5) * 5;

  if (!chart) {
    // Создаём график один раз
    chart = new Chart(gaussMatrixChart, {
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
          y: {
            min: minYRounded,
            max: maxYRounded,
          },
        },
      },
    });
  } else {
    // Обновляем существующий график
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

function handleSubmit(e) {
  e.preventDefault();

  let matrix, vector;

  try {
    matrix =
      gaussMatrixInput.value.trim() === ""
        ? [[]]
        : JSON.parse(gaussMatrixInput.value);
    vector =
      gaussVectorInput.value.trim() === ""
        ? []
        : JSON.parse(gaussVectorInput.value);

    if (!Array.isArray(matrix) || !Array.isArray(vector)) throw new Error();
  } catch {
    gaussResultSpan.innerHTML =
      "<p style='text-align:center'>Неверный формат данных</p>";
    if (chart) chart.destroy();
    return;
  }

  const n = matrix.length;
  if (
    !matrix.every((row) => Array.isArray(row) && row.length === n) ||
    vector.length !== n
  ) {
    gaussResultSpan.innerHTML =
      "<p style='text-align:center'>Размеры не совпадают</p>";
    if (chart) chart.destroy();
    return;
  }

  // Преобразуем все элементы в числа
  matrix = matrix.map((row) => row.map(Number));
  vector = vector.map(Number);

  // Решаем систему
  const result = gaussMethod(matrix, vector).map((x) => x.toFixed(3));

  gaussResultSpan.innerHTML = `<ul>${result
    .map((x, i) => `<li>x${i + 1} = ${x}</li>`)
    .join("")}</ul>`;
  drawChart(result);
}

gaussMatrixForm.addEventListener("submit", handleSubmit);
