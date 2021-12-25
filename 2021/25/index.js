import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const getKey = (row, col) => {
  return `${row}:${col}`;
};

const parseInput = (rows) => {
  let m = {};
  let rCount = 0;
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    rCount += 1;
    for (let j = 0; j < row.length; ++j) {
      m[getKey(i, j)] = row[j];
    }
  }
  return [m, rCount, rows[0].length];
};

const move = (m, rows, cols) => {
  let newM = {};
  let moves = 0;
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      let key = getKey(i, j);
      let item = m[key];
      if (item === '>') {
        let nextCol = (j + 1) % cols;
        let nextKey = getKey(i, nextCol);
        if (m[nextKey] === '.') {
          newM[nextKey] = item;
          newM[key] = '.';
          moves += 1;
          continue;
        }
      }
      if (newM[key]) {
        continue;
      }
      newM[key] = m[key];
    }
  }
  print(newM, rows, cols);

  m = newM;
  newM = {};

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      let key = getKey(i, j);
      let item = m[key];
      if (item === 'v') {
        let nextRow = (i + 1) % rows;
        let nextKey = getKey(nextRow, j);
        if (m[nextKey] === '.') {
          newM[nextKey] = item;
          newM[key] = '.';
          moves += 1;
          continue;
        }
      }
      if (newM[key]) {
        continue;
      }
      newM[key] = m[key];
    }
  }
  return [newM, moves];
};

const print = (m, rows, cols) => {
  for (let i = 0; i < rows; ++i) {
    let arr = [];
    for (let j = 0; j < cols; ++j) {
      arr.push(m[getKey(i, j)]);
    }
  }
};

export const part1 = (input) => {
  let [m, rows, cols] = parseInput(input);
  let moves;
  let count = 0;
  do {
    count += 1;
    moves = 0;
    let [newM, newMoves] = move(m, rows, cols);
    print(m, rows, cols);
    m = newM;
    print(newM, rows, cols);
    moves = newMoves;
  } while (moves > 0);
  return count;
};

export const part2 = () => {
  return 0;
};
