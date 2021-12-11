import { Matrix, Reducer } from '../../tools/index.js';

const flash = (arr, i, j, flashed) => {
  if (flashed[`${i}:${j}`]) {
    return 0;
  }

  if (arr[i]?.[j] === undefined) {
    return 0;
  }

  if (arr[i][j] <= 9) {
    return 0;
  }

  flashed[`${i}:${j}`] = true;
  arr[i][j] = 0;

  arr?.[i - 1]?.[j - 1] !== undefined && !flashed[`${i - 1}:${j - 1}`] && (arr[i - 1][j - 1] += 1);
  arr?.[i - 1]?.[j] !== undefined && !flashed[`${i - 1}:${j}`] && (arr[i - 1][j] += 1);
  arr?.[i - 1]?.[j + 1] !== undefined && !flashed[`${i - 1}:${j + 1}`] && (arr[i - 1][j + 1] += 1);
  arr?.[i]?.[j - 1] !== undefined && !flashed[`${i}:${j - 1}`] && (arr[i][j - 1] += 1);
  arr?.[i]?.[j + 1] !== undefined && !flashed[`${i}:${j + 1}`] && (arr[i][j + 1] += 1);
  arr?.[i + 1]?.[j - 1] !== undefined && !flashed[`${i + 1}:${j - 1}`] && (arr[i + 1][j - 1] += 1);
  arr?.[i + 1]?.[j] !== undefined && !flashed[`${i + 1}:${j}`] && (arr[i + 1][j] += 1);
  arr?.[i + 1]?.[j + 1] !== undefined && !flashed[`${i + 1}:${j + 1}`] && (arr[i + 1][j + 1] += 1);

  return 1;
};

export const part1 = (rows) => {
  let res = 0;
  let arr = [];
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (row.length) {
      arr.push(row.split('').map((i) => +i));
    }
  }
  for (let c = 0; c < 100; ++c) {
    let flashed = {};
    let localres = 0;

    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        arr[i][j] += 1;
      }
    }

    do {
      localres = 0;
      for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
          localres += flash(arr, i, j, flashed);
        }
      }
      res += localres;
    } while (localres > 0);
  }
  return res;
};

export const part2 = (rows) => {
  let res = 0;
  let arr = [];
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (row.length) {
      arr.push(row.split('').map((i) => +i));
    }
  }
  for (let c = 0; c < 100000; ++c) {
    let flashed = {};
    let localres = 0;

    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        arr[i][j] += 1;
      }
    }

    do {
      localres = 0;
      for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
          localres += flash(arr, i, j, flashed);
        }
      }
    } while (localres > 0);

    if (arr.every((row) => row.every((item) => item === 0))) {
      return c;
    }
  }
  return res;
};
