import { Matrix, Reducer } from '../../tools/index.js';

const solve = (rows, distanceFn) => {
  const arr = rows[0]
    .split(',')
    .filter(Boolean)
    .map((i) => +i);
  let minD = 999999999;
  for (let i = 0; i < arr.length; ++i) {
    let possible = new Array(arr.length).fill(i);
    const d = distanceFn(possible, arr);
    if (d < minD) {
      minD = d;
    }
  }
  return minD;
};

const distance = (arr1, arr2) => {
  let res = 0;
  for (let i = 0; i < arr1.length; ++i) {
    res += Math.abs(+arr1[i] - +arr2[i]);
  }
  return res;
};

const distance2 = (arr1, arr2) => {
  let res = 0;
  for (let i = 0; i < arr1.length; ++i) {
    let steps = Math.abs(+arr1[i] - +arr2[i]);
    let d = ((1 + steps) * steps) / 2;
    res += d;
  }
  return res;
};

export const part1 = (rows) => solve(rows, distance);
export const part2 = (rows) => solve(rows, distance2);
