import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const add = (state, toAdd) => {
  state.forEach((i) => (i.depth += 1));
  toAdd.forEach((i) => {
    i.depth += 1;
    state.push(i);
  });
};

const explode = (state) => {
  let count = 0;
  for (let i = 0; i < state.length; ++i) {
    const item = state[i];
    if (item.depth >= 5) {
      if (i > 0) {
        state[i - 1].value += item.value;
      }
      if (i < state.length - 2) {
        state[i + 2].value += state[i + 1].value;
      }
      count += 1;
      state[i].value = 0;
      state[i].depth -= 1;
      state.splice(i + 1, 1);
      break;
    }
  }
  return count;
};

const split = (state) => {
  let count = 0;
  for (let i = 0; i < state.length; ++i) {
    const item = state[i];
    if (item.value > 9) {
      const low = Math.floor(item.value / 2);
      const high = Math.ceil(item.value / 2);
      item.value = low;
      item.depth += 1;
      state.splice(i + 1, 0, { value: high, depth: item.depth });
      count += 1;
      break;
    }
  }
  return count;
};

const explodeAndSplit = (state) => {
  let count = 0;
  while (explode(state) > 0) {
    count += 1;
  }
  if (split(state) > 0) {
    count += 1;
  }
  return count;
};

const parseInput = (row) => {
  let depth = 0;
  let state = [];
  for (let i = 0; i < row.length; ++i) {
    let c = row[i];
    if (c === '[') {
      depth += 1;
    } else if (c === ']') {
      depth -= 1;
    } else if (c === ',') {
      continue;
    } else {
      state.push({ value: +c, depth });
    }
  }
  return state;
};

const magnitude = (state) => {
  while (state.length > 1) {
    for (let i = 0; i < state.length - 1; ++i) {
      if (state[i].depth === state[i + 1].depth) {
        const value = state[i].value * 3 + state[i + 1].value * 2;
        state[i].value = value;
        state[i].depth -= 1;
        state.splice(i + 1, 1);
        break;
      }
    }
  }
  return state[0].value;
};

export const part1 = (rows) => {
  let state = [];
  state = parseInput(rows[0]);
  for (let i = 1; i < rows.length; ++i) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    add(state, parseInput(rows[i]));
    while (explodeAndSplit(state) > 0) {}
  }
  return magnitude(state);
};

export const part2 = (rows) => {
  let maxMag = -Infinity;

  for (let i = 0; i < rows.length; ++i) {
    for (let j = 0; j < rows.length; ++j) {
      if (i === j) {
        continue;
      }
      const state = parseInput(rows[i]);
      add(state, parseInput(rows[j]));
      while (explodeAndSplit(state) > 0) {}
      const mag = magnitude(state);
      if (mag > maxMag) {
        maxMag = mag;
      }
    }
  }
  return maxMag;
};
