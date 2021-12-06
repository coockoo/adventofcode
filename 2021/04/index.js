import { Matrix, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  const calls = rows[0].split(',');
  let matrices = [];
  for (let i = 2; i < rows.length; i += 6) {
    let matrix = [];
    for (let j = 0; j < 5; ++j) {
      matrix.push(...rows[i + j].split(/\s+/).filter(Boolean));
    }
    matrices.push(matrix);
  }
  return [calls, matrices];
};

const isWin = (matrix, calls) => {
  const rows = [...Matrix.getRows(matrix), ...Matrix.getColumns(matrix)];
  return rows.some((row) => isRowWin(row, calls));
};

const isRowWin = (row, calls) => {
  return row.every((i) => calls.includes(i));
};

const getWinResult = (matrix, calls) => {
  const lastCall = +calls[calls.length - 1];
  const unmarked = matrix.filter((i) => !calls.includes(i));
  const sum = Reducer.sumOfItems(unmarked);
  return lastCall * sum;
};

export const part1 = (rows) => {
  const [calls, matrices] = parseInput(rows);
  let currentCalls = calls.slice(0, 5);
  for (let i = 5; i < calls.length; ++i) {
    currentCalls.push(calls[i]);
    for (let j = 0; j < matrices.length; ++j) {
      if (isWin(matrices[j], currentCalls)) {
        return getWinResult(matrices[j], currentCalls);
      }
    }
  }
};

export const part2 = (rows) => {
  let [calls, matrices] = parseInput(rows);
  let currentCalls = calls.slice(0, 5);
  for (let i = 5; i < calls.length; ++i) {
    currentCalls.push(calls[i]);
    let newMatrices = [];
    for (let j = 0; j < matrices.length; ++j) {
      if (isWin(matrices[j], currentCalls)) {
        if (matrices.length === 1) {
          return getWinResult(matrices[j], currentCalls);
        }
      } else {
        newMatrices.push(matrices[j]);
      }
    }
    matrices = newMatrices;
  }
};
