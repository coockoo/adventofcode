import { Matrix } from '../../tools/index.js';

const parseInput = (rows) => {
  return rows
    .filter((i) => i)
    .map((row) => {
      const pairs = row.split('->').map((i) => i.trim());
      const [x1, y1] = pairs[0].split(',').map((i) => +i);
      const [x2, y2] = pairs[1].split(',').map((i) => +i);
      return {
        x1,
        y1,
        x2,
        y2,
      };
    });
};

const solve = (rows, { withDiagonal }) => {
  const arr = parseInput(rows);
  const size = Math.max(...arr.flatMap((i) => [i.x1, i.x2, i.y1, i.y2]));
  const matrix = Array(Math.pow(size + 1, 2));
  for (let i = 0; i < arr.length; ++i) {
    let { x1, x2, y1, y2 } = arr[i];

    if (!withDiagonal && x1 !== x2 && y1 !== y2) {
      continue;
    }

    const dx = x1 === x2 ? 0 : x1 > x2 ? -1 : 1;
    const dy = y1 === y2 ? 0 : y1 > y2 ? -1 : 1;

    const cond = (x, y) => {
      return (dx > 0 ? x <= x2 : x >= x2) && (dy > 0 ? y <= y2 : y >= y2);
    };

    for (let x = x1, y = y1; cond(x, y); x += dx, y += dy) {
      Matrix.incItem(matrix, x, y);
    }
  }
  return matrix.filter((i) => i >= 2).length;
};

export const part1 = (rows) => {
  return solve(rows, { withDiagonal: false });
};

export const part2 = (rows) => {
  return solve(rows, { withDiagonal: true });
};
