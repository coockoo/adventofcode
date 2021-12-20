import { Matrix2 } from '../../tools/index.js';

const getKey = (i, j) => `${i};${j}`;
const fromKey = (key) => key.split(';').map((i) => +i);

const parseInput = (rows) => {
  const ref = rows[0].split('').map((i) => (i === '#' ? 1 : 0));
  const matrix = {};
  for (let i = 2; i < rows.length; ++i) {
    for (let j = 0; j < rows[i].length; ++j) {
      matrix[getKey(i - 2, j)] = rows[i][j] === '#' ? 1 : 0;
    }
  }
  return [ref, matrix];
};

const toDecimal = (binary) => {
  let res = 0;
  for (let i = 0; i < binary.length; ++i) {
    if (+binary[i] === 1) {
      res += Math.pow(2, binary.length - 1 - i);
    }
  }
  return res;
};

const getNeighbours = (row, col) => {
  let res = [];
  Matrix2.NEIGHBOURS_9.forEach(([dr, dc]) => {
    res.push(getKey(row + dr, col + dc));
  });
  return res;
};

const getBit = (matrix, ref, row, col, infinityBit) => {
  const n = getNeighbours(row, col);
  const bits = n.map((k) => matrix[k] ?? infinityBit);
  const t = toDecimal(bits);
  return ref[t];
};

const enhance = (matrix, ref, infinityBit) => {
  const resMatrix = {};
  const keys = Object.keys(matrix);
  const minCol = keys
    .map(fromKey)
    .map((i) => i[1])
    .sort((a, b) => a - b)[0];
  const maxCol = keys
    .map(fromKey)
    .map((i) => i[1])
    .sort((a, b) => b - a)[0];

  const minRow = keys
    .map(fromKey)
    .map((i) => i[0])
    .sort((a, b) => a - b)[0];
  const maxRow = keys
    .map(fromKey)
    .map((i) => i[0])
    .sort((a, b) => b - a)[0];

  while (keys.length) {
    const key = keys.pop();
    if (resMatrix[key] !== undefined) {
      continue;
    }
    const [row, col] = fromKey(key);
    const n = getNeighbours(row, col);

    const th = 1;
    if (row > maxRow + th || row < minRow - th || col > maxCol + th || col < minCol - th) {
      continue;
    }
    keys.push(...n);
    resMatrix[key] = getBit(matrix, ref, row, col, infinityBit);
  }
  return resMatrix;
};

const getInfinityBit = (ref, iteration) => {
  if (ref[0] === 0) {
    return ref[0];
  }
  return iteration % 2 ? ref[0] : ref[ref.length - 1];
};

const solve = (rows, iterations) => {
  let [ref, matrix] = parseInput(rows);
  for (let i = 0; i < iterations; ++i) {
    console.log(i + 1, '/', iterations);
    matrix = enhance(matrix, ref, getInfinityBit(ref, i));
  }
  return Object.values(matrix).filter((i) => i > 0).length;
};

export const part1 = (rows) => solve(rows, 2);
export const part2 = (rows) => solve(rows, 50);
