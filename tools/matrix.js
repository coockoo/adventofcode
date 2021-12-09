export const getSize = (matrix) => {
  return Math.sqrt(matrix.length);
};

export const getRow = (matrix, index) => {
  const size = getSize(matrix);
  const row = [];
  for (let i = 0; i < size; ++i) {
    row.push(matrix[i + index * size]);
  }
  return row;
};

export const getColumn = (matrix, index) => {
  const size = getSize(matrix);
  const row = [];
  for (let i = 0; i < size; ++i) {
    row.push(matrix[i * size + index]);
  }
  return row;
};

export const getRows = (matrix) => {
  let rows = [];
  const size = getSize(matrix);
  for (let i = 0; i < size; ++i) {
    rows.push(getRow(matrix, i));
  }
  return rows;
};

export const getColumns = (matrix) => {
  let columns = [];
  const size = getSize(matrix);
  for (let i = 0; i < size; ++i) {
    columns.push(getColumn(matrix, i));
  }
  return columns;
};

export const getItem = (matrix, x, y) => {
  const size = getSize(matrix);
  return matrix[size * y + x];
};

export const setItem = (matrix, x, y, value) => {
  const size = getSize(matrix);
  matrix[size * y + x] = value;
};

export const incItem = (matrix, x, y, amount = 1) => {
  const size = getSize(matrix);
  if (!matrix[size * y + x]) {
    matrix[size * y + x] = 0;
  }
  matrix[size * y + x] += amount;
};
