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

module.exports.Matrix = {
  getSize,
  getRow,
  getRows,
  getColumn,
  getColumns,
};
