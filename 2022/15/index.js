const getKey = (x, y) => `${x}:${y}`;
const getNeighbours = (x, y) => {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
};
const getArea = (x, y, d) => {
  let res = { [getKey(x, y)]: true };
  if (d === 0) {
    return res;
  }
  let c = 0;
  let outer = [[x, y]];
  while (c <= d) {
    let nOuter = [];
    while (outer.length) {
      const i = outer.pop();
      res[getKey(...i)] = true;
      const ns = getNeighbours(...i);
      for (let n of ns) {
        if (!res[getKey(...n)]) {
          nOuter.push(n);
        }
      }
    }
    outer = nOuter;
    c += 1;
  }
  return res;
};
export const part1 = (rows) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const m = [];

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    const match = row.match(/^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
    if (!match) {
      continue;
    }
    const [sx, sy, bx, by] = match.slice(1, 5).map((i) => +i);
    m.push({ sx, sy, bx, by });

    minX = Math.min(sx, bx, minX);
    minY = Math.min(sy, by, minY);

    maxX = Math.max(sx, bx, maxX);
    maxY = Math.max(sy, by, maxY);
  }

  let res = 0;
  for (let x = -3 * maxX; x <= 3 * maxX; ++x) {
    for (let i = 0; i < m.length; ++i) {
      if (isIn(x, 2000000, m[i])) {
        res += 1;
        break;
      }
    }
  }

  return res;
};

const getRadius = (sb) => {
  const { sx, bx, sy, by } = sb;
  return Math.abs(sx - bx) + Math.abs(sy - by);
};

const isIn = (x, y, sb) => {
  const { sx, bx, sy, by } = sb;
  const maxD = Math.abs(sx - bx) + Math.abs(sy - by);
  const d = Math.abs(sx - x) + Math.abs(sy - y);
  return d <= maxD && (x !== bx || y !== by);
};

export const part2 = (rows) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  let m = [];

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    const match = row.match(/^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
    if (!match) {
      continue;
    }
    const [sx, sy, bx, by] = match.slice(1, 5).map((i) => +i);
    m.push({ sx, sy, bx, by });

    minX = Math.min(sx, bx, minX);
    minY = Math.min(sy, by, minY);

    maxX = Math.max(sx, bx, maxX);
    maxY = Math.max(sy, by, maxY);
  }

  for (let i = 0; i < m.length; ++i) {
    const r = getRadius(m[i]) + 1;
    const { sx, sy } = m[i];

    for (let d = 0; d <= r; ++d) {
      const dx = d;
      const dy = r - d;
      const x = sx + dx;
      const y = sy + dy;

      // const max = 20;
      const max = 4000000;
      if (x < 0 || x > max || y < 0 || y > max) {
        continue;
      }

      const t = m.find((mk) => isIn2(x, y, mk));
      if (!t) {
        return x * 4000000 + y;
      }
    }
  }

  return 0;
};

const isIn2 = (x, y, sb) => {
  const { sx, bx, sy, by } = sb;
  const maxD = Math.abs(sx - bx) + Math.abs(sy - by);
  const d = Math.abs(sx - x) + Math.abs(sy - y);
  return d <= maxD;
};
