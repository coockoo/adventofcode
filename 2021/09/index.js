import { Matrix, Reducer } from '../../tools/index.js';

const getNeighbours = (arr, row, col) => {
  let n = [arr[row]?.[col - 1], arr[row]?.[col + 1], arr[row - 1]?.[col], arr[row + 1]?.[col]];
  return n.filter((i) => i !== undefined);
};

const isLowest = (p, n) => {
  return n.every((i) => i > p);
};

export const part1 = (rows) => {
  let arr = [];
  for (let i = 0; i < rows.length; ++i) {
    const b = [];
    for (let j = 0; j < rows[i].length; ++j) {
      b.push(+rows[i][j]);
    }
    arr.push(b);
  }

  let res = 0;
  for (let i = 0; i < rows.length; ++i) {
    for (let j = 0; j < rows[i].length; ++j) {
      const n = getNeighbours(arr, i, j);
      res += isLowest(arr[i][j], n) ? arr[i][j] + 1 : 0;
    }
  }
  return res;
};

export const part2 = (rows) => {
  let arr = [];
  for (let i = 0; i < rows.length; ++i) {
    const b = [];
    for (let j = 0; j < rows[i].length; ++j) {
      b.push(+rows[i][j]);
    }
    arr.push(b);
  }

  let res = [];
  let found = {};
  for (let i = 0; i < rows.length; ++i) {
    for (let j = 0; j < rows[i].length; ++j) {
      if (found[`${i}:${j}`]) {
        continue;
      }
      const size = getBasin(arr, i, j, found);
      if (size) {
        res.push(size);
      }
    }
  }
  const t = res.sort((a, b) => b - a);
  return t[0] * t[1] * t[2];
};

const getBasin = (arr, row, col, found) => {
  const item = arr?.[row]?.[col];
  if (item === undefined) {
    return 0;
  }
  if (item === 9) {
    found[`${row}:${col}`] = true;
    return 0;
  }
  if (found[`${row}:${col}`]) {
    return 0;
  }

  let res = 1;
  found[`${row}:${col}`] = true;
  res += getBasin(arr, row, col + 1, found);
  res += getBasin(arr, row, col - 1, found);
  res += getBasin(arr, row + 1, col, found);
  res += getBasin(arr, row - 1, col, found);
  return res;
};
