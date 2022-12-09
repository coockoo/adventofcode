const isNear = (p1, p2) => {
  return Math.abs(p1[0] - p2[0]) <= 1 && Math.abs(p1[1] - p2[1]) <= 1;
};

const move = (tpos, dir) => {
  if (dir === 'U') {
    tpos[1] += 1;
  }
  if (dir === 'D') {
    tpos[1] -= 1;
  }
  if (dir === 'L') {
    tpos[0] -= 1;
  }
  if (dir === 'R') {
    tpos[0] += 1;
  }
};

const solve = (rows, tailSize) => {
  const tpos = Array(tailSize)
    .fill(undefined)
    .map(() => [0, 0]);
  const positions = {};

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const [dir, amount] = row.split(' ');
    for (let j = 0; j < +amount; ++j) {
      move(tpos[0], dir);
      for (let k = 1; k < tpos.length; ++k) {
        if (isNear(tpos[k], tpos[k - 1])) {
          break;
        }

        const dx = tpos[k - 1][0] - tpos[k][0];
        const dy = tpos[k - 1][1] - tpos[k][1];

        if (dx <= -2) {
          tpos[k][0] -= 1;
          if (Math.abs(dy) === 1) {
            tpos[k][1] = tpos[k - 1][1];
          }
        }
        if (dx >= 2) {
          tpos[k][0] += 1;
          if (Math.abs(dy) === 1) {
            tpos[k][1] = tpos[k - 1][1];
          }
        }
        if (dy <= -2) {
          tpos[k][1] -= 1;
          if (Math.abs(dx) === 1) {
            tpos[k][0] = tpos[k - 1][0];
          }
        }
        if (dy >= 2) {
          tpos[k][1] += 1;
          if (Math.abs(dx) === 1) {
            tpos[k][0] = tpos[k - 1][0];
          }
        }
      }
      positions[tpos.at(-1).join(':')] = true;
    }
  }
  return Object.keys(positions).length;
};

export const part1 = (rows) => solve(rows, 2);
export const part2 = (rows) => solve(rows, 10);

const draw = (tail) => {
  const minX = Math.min(...tail.map(([i]) => i));
  const maxX = Math.max(...tail.map(([i]) => i));

  const minY = Math.min(...tail.map(([_, i]) => i));
  const maxY = Math.max(...tail.map(([_, i]) => i));

  let rows = [];
  for (let i = minY - 10; i <= maxY; ++i) {
    let row = [];
    for (let j = minX; j <= maxX; ++j) {
      const idx = tail.findIndex((k) => k[0] === j && k[1] === i);
      row.push(idx >= 0 ? idx : '.');
    }
    rows.push(row.join(''));
  }
  console.log(rows.reverse().join('\n'));
  console.log();
};
