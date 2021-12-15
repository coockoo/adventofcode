import { Matrix2 } from '../../tools/index.js';

const getKey = ([row, col]) => {
  return `${row}:${col}`;
};

export const part1 = (rows) => {
  const matrix = Matrix2.fromNumeric(rows);
  const m = matrix.to2D();
  let points = [];
  for (let i = 0; i < m.length; ++i) {
    for (let j = 0; j < m.length; ++j) {
      points.push([i, j]);
    }
  }
  let target = [m.length - 1, m[0].length - 1];
  let tk = getKey(target);
  let weights = { [getKey(points[0])]: 0 };

  while (points.length) {
    let point = getPriorityPoint(points, weights);
    let pk = getKey(point);
    const ds = Matrix2.NEIGHBOURS_4;
    for (let d = 0; d < ds.length; ++d) {
      const [dr, dc] = ds[d];
      if (m[point[0] + dr]?.[point[1] + dc] !== undefined) {
        let n = [point[0] + dr, point[1] + dc];
        let nk = getKey(n);

        if (!weights[nk]) {
          weights[nk] = Infinity;
        }
        weights[nk] = Math.min(weights[nk], weights[pk] + m[n[0]][n[1]]);
      }
    }
  }
  return weights[tk];
};

const getPriorityPoint = (points, weights) => {
  let point = points[0];
  let idx = 0;
  for (let i = 1; i < points.length; ++i) {
    if (weights[getKey(points[i])] < weights[getKey(point)]) {
      point = points[i];
      idx = i;
    }
  }
  points.splice(idx, 1);
  return point;
};

export const part2 = (rows) => {
  const matrix = Matrix2.fromNumeric(rows);
  const m = matrix.to2D();

  let points = [[0, 0]];

  let target = [m.length * 5 - 1, m[0].length * 5 - 1];
  let tk = getKey(target);
  let weights = { [getKey(points[0])]: 0 };
  let visited = { '0:0': true };

  while (points.length) {
    console.log(points.length);
    let point = getPriorityPoint(points, weights);
    let pk = getKey(point);
    const ds = Matrix2.NEIGHBOURS_4;
    for (let d = 0; d < ds.length; ++d) {
      const [dr, dc] = ds[d];
      const value = getValue(m, point[0] + dr, point[1] + dc);
      if (value !== undefined) {
        let n = [point[0] + dr, point[1] + dc];
        let nk = getKey(n);

        if (!weights[nk]) {
          weights[nk] = Infinity;
        }
        weights[nk] = Math.min(weights[nk], weights[pk] + getValue(m, n[0], n[1]));
        if (!visited[nk]) {
          points.push(n);
        }
        visited[nk] = true;
      }
    }
  }
  return weights[tk];
};

const getValue = (m, row, col) => {
  const size = m.length;
  if (!(row >= 0 && col >= 0 && col < size * 5 && row < size * 5)) {
    return undefined;
  }
  const colInc = Math.floor(col / size);
  const rowInc = Math.floor(row / size);
  const realRow = row % size;
  const realCol = col % size;
  const value = m[realRow][realCol];
  const newValue = value + colInc + rowInc;
  return newValue > 9 ? (newValue % 10) + 1 : newValue;
};
