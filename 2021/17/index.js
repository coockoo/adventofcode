import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  const row = rows[0];
  const split = row.split(' ');
  const xSplit = split[2];
  const ySplit = split[3];

  const xArea = xSplit
    .split('=')[1]
    .split(',')[0]
    .split('..')
    .map((i) => +i);
  const yArea = ySplit
    .split('=')[1]
    .split('..')
    .map((i) => +i);
  return [xArea, yArea];
};

const move = (point, velocity) => {
  let x = point[0] + velocity[0];
  let y = point[1] + velocity[1];

  let vx = velocity[0];
  if (vx > 0) {
    vx -= 1;
  } else if (vx < 0) {
    vx += 1;
  }

  let vy = velocity[1] - 1;

  return [
    [x, y],
    [vx, vy],
  ];
};

const isOvershoot = (point, targetX, targetY) => {
  return point[0] > targetX[1] || point[1] < targetY[0];
};

const isIn = (point, targetX, targetY) => {
  return point[0] >= targetX[0] && point[0] <= targetX[1] && point[1] >= targetY[0] && point[1] <= targetY[1];
};

const shoot = (velocity, targetX, targetY) => {
  let point = [0, 0];
  let maxY = 0;
  while (!isOvershoot(point, targetX, targetY) && !isIn(point, targetX, targetY)) {
    [point, velocity] = move(point, velocity);
    if (point[1] > maxY) {
      maxY = point[1];
    }
  }
  return isIn(point, targetX, targetY) ? [...point, maxY] : null;
};

export const part1 = (rows) => {
  const [xArea, yArea] = parseInput(rows);
  let maxY = 0;
  for (let i = 1; i < 1000; ++i) {
    for (let j = -1000; j < 1000; ++j) {
      const res = shoot([i, j], xArea, yArea);
      if (res && res[2] > maxY) {
        maxY = res[2];
      }
    }
  }
  return maxY;
};

export const part2 = (rows) => {
  const [xArea, yArea] = parseInput(rows);
  let counter = 0;
  for (let i = 1; i < 1000; ++i) {
    for (let j = -1000; j < 1000; ++j) {
      const res = shoot([i, j], xArea, yArea);
      if (res) {
        counter += 1;
      }
    }
  }
  return counter;
};
