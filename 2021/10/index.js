import { Matrix, Reducer } from '../../tools/index.js';

const amount = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

export const part1 = (rows) => {
  let res = 0;
  for (let i = 0; i < rows.length; ++i) {
    let stack = [];
    for (let j = 0; j < rows[i].length; ++j) {
      if (['<', '{', '[', '('].includes(rows[i][j])) {
        stack.push(rows[i][j]);
      } else {
        const last = stack.pop();
        if (last === '(' && rows[i][j] !== ')') {
          res += amount[rows[i][j]];
          break;
        }
        if (last === '[' && rows[i][j] !== ']') {
          res += amount[rows[i][j]];
          break;
        }
        if (last === '{' && rows[i][j] !== '}') {
          res += amount[rows[i][j]];
          break;
        }
        if (last === '<' && rows[i][j] !== '>') {
          res += amount[rows[i][j]];
          break;
        }
      }
    }
  }
  return res;
};

export const part2 = (rows) => {
  let res = [];
  for (let i = 0; i < rows.length; ++i) {
    if (!rows[i]) {
      continue;
    }
    let stack = [];
    let isIncomplete = true;
    for (let j = 0; j < rows[i].length; ++j) {
      if (['<', '{', '[', '('].includes(rows[i][j])) {
        stack.push(rows[i][j]);
      } else {
        const last = stack.pop();
        if (last === '(' && rows[i][j] !== ')') {
          isIncomplete = false;
          break;
        }
        if (last === '[' && rows[i][j] !== ']') {
          isIncomplete = false;
          break;
        }
        if (last === '{' && rows[i][j] !== '}') {
          isIncomplete = false;
          break;
        }
        if (last === '<' && rows[i][j] !== '>') {
          isIncomplete = false;
          break;
        }
      }
    }
    if (isIncomplete) {
      let localres = 0;
      while (stack.length) {
        const last = stack.pop();
        if (last === '(') {
          localres *= 5;
          localres += 1;
        } else if (last === '[') {
          localres *= 5;
          localres += 2;
        }
        if (last === '{') {
          localres *= 5;
          localres += 3;
        }
        if (last === '<') {
          localres *= 5;
          localres += 4;
        }
      }
      res.push(localres);
    }
  }
  return res.sort((a, b) => a - b)[Math.floor(res.length / 2)];
};
