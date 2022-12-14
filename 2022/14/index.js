const parse = (rows) => {
  let map = {};
  let maxY = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const coords = row.split(' -> ');
    map[coords[0]] = true;
    for (let j = 1; j < coords.length; j++) {
      const [x0, y0] = coords[j - 1].split(',').map((i) => +i);
      const [x1, y1] = coords[j].split(',').map((i) => +i);
      const xf = Math.min(x0, x1);
      const xt = Math.max(x0, x1);

      const yf = Math.min(y0, y1);
      const yt = Math.max(y0, y1);
      maxY = Math.max(maxY, y0, y1);

      for (let x = xf; x <= xt; ++x) {
        for (let y = yf; y <= yt; ++y) {
          map[`${x},${y}`] = true;
        }
      }
    }
  }
  return { map, maxY };
};
export const part1 = (rows) => {
  const { map, maxY } = parse(rows);
  let res = 0;
  let lastLandY = -1;
  while (lastLandY < maxY) {
    const lastLand = drop(map, 500, 0, maxY + 2);
    lastLandY = +lastLand.split(',')[1];
    res += 1;
  }
  return res - 1;
};

export const part2 = (rows) => {
  const { map, maxY } = parse(rows);
  let res = 0;
  let lastLand;
  while (lastLand !== '500,0') {
    lastLand = drop(map, 500, 0, maxY + 2);
    res += 1;
  }
  return res;
};

const drop = (map, x, y, maxY) => {
  if (!map[`${x},${y + 1}`] && y + 1 < maxY) {
    return drop(map, x, y + 1, maxY);
  }

  if (!map[`${x - 1},${y + 1}`] && y + 1 < maxY) {
    return drop(map, x - 1, y + 1, maxY);
  }

  if (!map[`${x + 1},${y + 1}`] && y + 1 < maxY) {
    return drop(map, x + 1, y + 1, maxY);
  }

  const key = `${x},${y}`;
  map[key] = true;
  return key;
};
