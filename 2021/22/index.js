import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const getKey = (x, y, z) => {
  return `${x},${y},${z}`;
};

const parseInput = (rows) => {
  let arr = [];
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    let [cmd, coordRaw] = row.split(' ');
    let [xr, yr, zr] = coordRaw.split(',');
    let x = xr
      .split('=')[1]
      .split('..')
      .map((i) => +i);
    x[1] += 1;
    let y = yr
      .split('=')[1]
      .split('..')
      .map((i) => +i);
    y[1] += 1;
    let z = zr
      .split('=')[1]
      .split('..')
      .map((i) => +i);
    z[1] += 1;
    arr.push({ cmd, x, y, z });
  }
  return arr;
};

export const part1 = (rows) => {
  const arr = parseInput(rows);
  let m = {};
  for (let i = 0; i < arr.length; ++i) {
    let { cmd } = arr[i];
    for (let x = arr[i].x[0]; x < arr[i].x[1]; ++x) {
      if (x < -50 || x > 50) {
        continue;
      }
      for (let y = arr[i].y[0]; y < arr[i].y[1]; ++y) {
        if (y < -50 || y > 50) {
          continue;
        }
        for (let z = arr[i].z[0]; z < arr[i].z[1]; ++z) {
          if (z < -50 || z > 50) {
            continue;
          }
          m[getKey(x, y, z)] = cmd === 'on' ? true : false;
        }
      }
    }
  }
  return Object.values(m).filter((i) => i).length;
};

const isLineIntersecting = (a, b) => {
  return b[0] < a[1] && a[0] < b[1];
};

const isIntersecting = (a, b) => {
  const { x: ax, y: ay, z: az } = a;
  const { x: bx, y: by, z: bz } = b;
  return isLineIntersecting(ax, bx) && isLineIntersecting(ay, by) && isLineIntersecting(az, bz);
};

const points = (a, b) => {
  const bInA = b.filter((i) => i > a[0] && i < a[1]);
  return [a[0], ...bInA, a[1]];
};

const subtract = (fromShape, shape) => {
  if (!isIntersecting(fromShape, shape)) {
    return [fromShape];
  }

  const { x, y, z } = fromShape;
  const { x: sx, y: sy, z: sz } = shape;

  const kx = points(x, sx);
  const ky = points(y, sy);
  const kz = points(z, sz);

  let blocks = [];
  for (let i = 0; i < kx.length - 1; ++i) {
    for (let j = 0; j < ky.length - 1; ++j) {
      for (let k = 0; k < kz.length - 1; ++k) {
        blocks.push({
          x: [kx[i], kx[i + 1]],
          y: [ky[j], ky[j + 1]],
          z: [kz[k], kz[k + 1]],
        });
      }
    }
  }

  return blocks.filter((b) => !isIntersecting(b, shape));
};

export const part2 = (rows) => {
  const arr = parseInput(rows);
  let shapes = [];

  for (let i = 0; i < arr.length; ++i) {
    const { cmd, ...rest } = arr[i];
    shapes = shapes.flatMap((shape) => subtract(shape, rest));
    if (cmd === 'on') {
      shapes.push(rest);
    }
  }

  let res = 0;
  for (let i = 0; i < shapes.length; ++i) {
    const { x, y, z } = shapes[i];
    const lr = (x[1] - x[0]) * (y[1] - y[0]) * (z[1] - z[0]);
    res += lr;
  }

  return res;
};
