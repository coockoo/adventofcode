import { Reducer } from '../../tools/index.js';

const getNeighbours = (arr, row, col) => {
  let n = [arr[row]?.[col - 1], arr[row]?.[col + 1], arr[row - 1]?.[col], arr[row + 1]?.[col]];
  return n.filter((i) => i !== undefined);
};

const isLowest = (p, n) => {
  return n.every((i) => i > p);
};

const parseInput = (rows) => {
  const arr = [];
  for (let i = 0; i < rows.length; ++i) {
    arr.push(rows[i].split('').map((i) => +i));
  }
  return arr;
};

export const part1 = (rows) => {
  let arr = parseInput(rows);
  let res = 0;
  for (let i = 0; i < rows.length; ++i) {
    for (let j = 0; j < rows[i].length; ++j) {
      const item = arr[i][j];
      const n = getNeighbours(arr, i, j);
      res += isLowest(item, n) ? item + 1 : 0;
    }
  }
  return res;
};

export const part2 = (rows) => {
  let arr = parseInput(rows);

  let res = [];
  let found = {};
  for (let i = 0; i < rows.length; ++i) {
    for (let j = 0; j < rows[i].length; ++j) {
      if (isFound(found, i, j)) {
        continue;
      }
      const size = getBasinSize(arr, i, j, found);
      if (size) {
        res.push(size);
      }
    }
  }

  const orderedSizes = res.sort((a, b) => b - a);
  const topThree = orderedSizes.slice(0, 3);
  return Reducer.productOfItems(topThree);
};

const getBasinSize = (arr, row, col, found) => {
  const item = arr?.[row]?.[col];
  if (item === undefined) {
    return 0;
  }
  if (item === 9) {
    setFound(found, row, col);
    return 0;
  }
  if (isFound(found, row, col)) {
    return 0;
  }

  let res = 1;
  setFound(found, row, col);

  res += getBasinSize(arr, row, col + 1, found);
  res += getBasinSize(arr, row, col - 1, found);
  res += getBasinSize(arr, row + 1, col, found);
  res += getBasinSize(arr, row - 1, col, found);

  return res;
};

const getKey = (row, col) => {
  return `${row}:${col}`;
};

const isFound = (state, row, col) => {
  return !!state[getKey(row, col)];
};

const setFound = (state, row, col) => {
  return (state[getKey(row, col)] = true);
};
