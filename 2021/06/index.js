import { Reducer } from '../../tools/index.js';

const solve = (rows, iterations) => {
  const arr = rows[0].split(',').map(Number);
  const state = Reducer.countBy(arr);

  for (let i = 0; i < iterations; ++i) {
    const t = state[0] || 0;
    for (let j = 1; j <= 8; ++j) {
      state[j - 1] = state[j] || 0;
    }
    state[8] = t || 0;
    state[6] += t || 0;
  }

  const res = Reducer.sumOfItems(Object.values(state));
  return res;
};

export const part1 = (rows) => {
  return solve(rows, 80);
};

export const part2 = (rows) => {
  return solve(rows, 256);
};
