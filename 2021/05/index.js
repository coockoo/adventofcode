const { Matrix, Reducer } = require('../../tools');

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

module.exports.part1 = (rows) => {
  const arr = parseInput(rows);
  const res = [];
  for (let i = 0; i < arr.length; ++i) {
    let { x1, x2, y1, y2 } = arr[i];
    if (x1 !== x2 && y1 !== y2) {
      continue;
    }
    const fromX = Math.min(x1, x2);
    const toX = x1 + x2 - fromX;
    const fromY = Math.min(y1, y2);
    const toY = y1 + y2 - fromY;
    for (let x = fromX; x <= toX; ++x) {
      for (let y = fromY; y <= toY; ++y) {
        if (!res[1000 * y + x]) {
          res[1000 * y + x] = 0;
        }
        res[1000 * y + x] += 1;
      }
    }
  }
  return res.filter((i) => i >= 2).length;
};

module.exports.part2 = (rows) => {
  const arr = parseInput(rows);
  const res = [];
  for (let i = 0; i < arr.length; ++i) {
    let { x1, x2, y1, y2 } = arr[i];

    if (x1 !== x2 && y1 !== y2) {
      const dx = x1 > x2 ? -1 : 1;
      const dy = y1 > y2 ? -1 : 1;
      for (let x = x1, y = y1; dx > 0 ? x <= x2 : x >= x2; x += dx, y += dy) {
        if (!res[1000 * y + x]) {
          res[1000 * y + x] = 0;
        }
        res[1000 * y + x] += 1;
      }
      continue;
    }

    const fromX = Math.min(x1, x2);
    const toX = x1 + x2 - fromX;
    const fromY = Math.min(y1, y2);
    const toY = y1 + y2 - fromY;

    for (let x = fromX; x <= toX; ++x) {
      for (let y = fromY; y <= toY; ++y) {
        if (!res[1000 * y + x]) {
          res[1000 * y + x] = 0;
        }
        res[1000 * y + x] += 1;
      }
    }
  }
  return res.filter((i) => i >= 2).length;
};
