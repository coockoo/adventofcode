const getSize = (matrix) => {
  return Math.sqrt(matrix.length);
};

const getRow = (matrix, index) => {
  const size = getSize(matrix);
  const row = [];
  for (let i = 0; i < size; ++i) {
    row.push(matrix[i + index * size]);
  }
  return row;
};

const getColumn = (matrix, index) => {
  const size = getSize(matrix);
  const row = [];
  for (let i = 0; i < size; ++i) {
    row.push(matrix[i * size + index]);
  }
  return row;
};

const getRows = (matrix) => {
  let rows = [];
  const size = getSize(matrix);
  for (let i = 0; i < size; ++i) {
    rows.push(getRow(matrix, i));
  }
  return rows;
};

const getColumns = (matrix) => {
  let rows = [];
  const size = getSize(matrix);
  for (let i = 0; i < size; ++i) {
    rows.push(getColumn(matrix, i));
  }
  return rows;
};

const getItem = (matrix, x, y) => {
  const size = getSize(matrix);
  return matrix[size * y + x];
};

const setItem = (matrix, x, y, value) => {
  const size = getSize(matrix);
  matrix[size * y + x] = value;
};

const incItem = (matrix, x, y, amount = 1) => {
  const size = getSize(matrix);
  if (!matrix[size * y + x]) {
    matrix[size * y + x] = 0;
  }
  matrix[size * y + x] += amount;
};

module.exports.Matrix = {
  getSize,
  getRow,
  getRows,
  getColumn,
  getColumns,
  getItem,
  setItem,
  incItem,
};
