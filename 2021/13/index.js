import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  let folds = [];
  let items = [];
  let mode = 'items';
  for (let i = 0; i < rows.length; ++i) {
    if (!rows[i]) {
      mode = 'folds';
      continue;
    }
    if (mode === 'items') {
      items.push(rows[i].split(',').map((i) => +i));
    }
    if (mode === 'folds') {
      const [, , rawFold] = rows[i].split(' ');
      const [axis, amount] = rawFold.split('=');
      folds.push({ axis, amount: +amount });
    }
  }
  return [items, folds];
};

export const part1 = (rows) => {
  const [items, folds] = parseInput(rows);
  let fold = folds[0];
  console.log(items, fold);

  const maxX = Math.max(...items.map(([i]) => i)) + 1;
  const maxY = Math.max(...items.map(([, i]) => i)) + 1;

  const matrix = Matrix2.fill(maxX, maxY, '.');

  for (let i = 0; i < items.length; ++i) {
    const [x, y] = items[i];
    matrix.setItem(y, x, '#');
  }

  if (fold.axis === 'y') {
    for (let i = fold.amount + 1; i < maxY; ++i) {
      for (let j = 0; j < maxX; ++j) {
        const item = matrix.getItem(i, j);
        if (item === '#') {
          matrix.setItem(maxY - i - 1, j, item);
        }
        matrix.setItem(i, j, '.');
      }
    }
  }

  if (fold.axis === 'x') {
    for (let j = fold.amount + 1; j < maxX; ++j) {
      for (let i = 0; i < maxY; ++i) {
        const item = matrix.getItem(i, j);
        if (item === '#') {
          matrix.setItem(i, maxX - j - 1, item);
        }
        matrix.setItem(i, j, '.');
      }
    }
  }

  return matrix.getItems().filter((i) => i === '#').length;
};

export const part2 = (rows) => {
  let res = 0;
  const [items, folds] = parseInput(rows);

  let maxX = -1;
  let maxY = -1;
  for (let i = 0; i < items.length; ++i) {
    const [x, y] = items[i];
    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
  }

  maxX += 1;
  maxY += 1;

  const matrix = Matrix2.fill(maxX, maxY, '.');

  for (let i = 0; i < items.length; ++i) {
    const [x, y] = items[i];
    matrix.setItem(y, x, '#');
  }

  for (let k = 0; k < folds.length; ++k) {
    const fold = folds[k];

    if (fold.axis === 'y') {
      for (let i = fold.amount + 1; i < maxY; ++i) {
        for (let j = 0; j < maxX; ++j) {
          const item = matrix.getItem(i, j);
          if (item === '#') {
            matrix.setItem(maxY - i - 1, j, item);
          }
          matrix.setItem(i, j, '.');
        }
      }

      for (let i = maxY - 1; i >= fold.amount; --i) {
        matrix.deleteRow(i);
      }
      maxY = fold.amount;
    }

    if (fold.axis === 'x') {
      for (let j = fold.amount + 1; j < maxX; ++j) {
        for (let i = 0; i < maxY; ++i) {
          const item = matrix.getItem(i, j);
          if (item === '#') {
            matrix.setItem(i, maxX - j - 1, item);
          }
          matrix.setItem(i, j, '.');
        }
      }
      for (let i = maxX - 1; i >= fold.amount; --i) {
        matrix.deleteColumn(i);
      }
      maxX = fold.amount;
    }
  }

  console.log(matrix.toString());

  return 0;
};
