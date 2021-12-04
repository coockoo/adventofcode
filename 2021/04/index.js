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
  const size = 5;
  for (let i = 0; i < size; ++i) {
    if (
      isRowWin(
        [matrix[0 + i * size], matrix[1 + i * size], matrix[2 + i * size], matrix[3 + i * size], matrix[4 + i * size]],
        calls
      )
    ) {
      return true;
    }
    if (
      isRowWin(
        [matrix[0 * size + i], matrix[1 * size + i], matrix[2 * size + i], matrix[3 * size + i], matrix[4 * size + i]],
        calls
      )
    ) {
      return true;
    }
  }
  return false;
};

const isRowWin = (row, calls) => {
  return row.every((i) => calls.includes(i));
};

const getWinResult = (matrix, calls) => {
  const lastCall = calls[calls.length - 1];
  const unmarked = matrix
    .filter((i) => !calls.includes(i))
    .reduce((acc, i) => {
      acc += +i;
      return acc;
    }, 0);
  return +lastCall * unmarked;
};

module.exports.part1 = (rows) => {
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

module.exports.part2 = (rows) => {
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
