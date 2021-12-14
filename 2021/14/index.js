import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  let poly = rows[0].split('');
  let sub = {};
  for (let i = 2; i < rows.length; ++i) {
    const [from, to] = rows[i].split(' -> ');
    if (from) {
      sub[from] = to;
    }
  }
  return [poly, sub];
};

const solve = (rows, iterations) => {
  let [poly, sub] = parseInput(rows);

  let obj = {};

  for (let i = 0; i < poly.length - 1; ++i) {
    const k = [poly[i], poly[i + 1]].join('');
    if (!obj[k]) {
      obj[k] = 0;
    }
    obj[k] += 1;
  }

  for (let c = 0; c < iterations; ++c) {
    let newObj = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const k = keys[i];
      const [p1, p2] = k.split('');
      const s = sub[k];
      const k1 = [p1, s].join('');
      const k2 = [s, p2].join('');

      if (!newObj[k1]) {
        newObj[k1] = 0;
      }
      newObj[k1] += obj[k];

      if (!newObj[k2]) {
        newObj[k2] = 0;
      }
      newObj[k2] += obj[k];
    }
    obj = newObj;
  }

  const keys = Object.keys(obj);

  const res = {
    [poly[0]]: 1,
    [poly[poly.length - 1]]: 1,
  };

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const [l, r] = key.split('');
    if (!res[l]) {
      res[l] = 0;
    }
    res[l] += obj[key];

    if (!res[r]) {
      res[r] = 0;
    }
    res[r] += obj[key];
  }

  let values = Object.values(res);
  return (Math.max(...values) - Math.min(...values)) / 2;
};

export const part1 = (rows) => solve(rows, 10);
export const part2 = (rows) => solve(rows, 40);
