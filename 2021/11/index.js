import { Matrix2 } from '../../tools/index.js';

const SIZE = 10;

const flash = (matrix, i, j, flashed) => {
  if (flashed[`${i}:${j}`]) {
    return 0;
  }

  if (!matrix.isIn(i, j)) {
    return 0;
  }

  if (matrix.getItem(i, j) <= 9) {
    return 0;
  }

  flashed[`${i}:${j}`] = true;
  matrix.setItem(i, j, 0);

  Matrix2.NEIGHBOURS_8.forEach(([di, dj]) => {
    if (!flashed[`${i + di}:${j + dj}`]) {
      matrix.incItem(i + di, j + dj);
    }
  });

  return 1;
};

export const part1 = (rows) => {
  const matrix = Matrix2.fromNumeric(rows);

  let res = 0;
  let iterationsCount = 100;

  for (let c = 0; c < iterationsCount; ++c) {
    let flashed = {};
    let localres = 0;

    matrix.incAll();

    do {
      localres = 0;
      for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
          localres += flash(matrix, i, j, flashed);
        }
      }
      res += localres;
    } while (localres > 0);
  }
  return res;
};

export const part2 = (rows) => {
  const matrix = Matrix2.fromNumeric(rows);

  let iteration = 0;

  while (true) {
    iteration += 1;
    const flashed = {};

    matrix.incAll();

    let localres = 0;
    do {
      localres = 0;
      for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
          localres += flash(matrix, i, j, flashed);
        }
      }
    } while (localres > 0);

    if (matrix.getItems().every((i) => i === 0)) {
      break;
    }
  }

  return iteration;
};
