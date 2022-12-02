const scores = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
};

const isWin = (an, bn) => {
  const r = bn - an;
  return r === 1 || r === -2;
};

const next = (score) => (score % 3) + 1;
const prev = (score) => {
  const t = score - 1;
  return t <= 0 ? 3 : t;
};

export const part1 = (rows) => {
  let res = 0;
  for (const idx in rows) {
    const row = rows[idx];
    if (!row) {
      continue;
    }
    const [a, b] = row.split(' ');
    const an = scores[a];
    const bn = scores[b];
    res += bn;
    if (isWin(an, bn)) {
      res += 6;
    }
    if (an == bn) {
      res += 3;
    }
  }
  return res;
};

export const part2 = (rows) => {
  let res = 0;
  for (const idx in rows) {
    const row = rows[idx];
    if (!row) {
      continue;
    }
    const [a, b] = row.split(' ');
    const an = scores[a];
    if (b === 'X') {
      res += prev(an);
    }
    if (b === 'Y') {
      res += 3 + an;
    }
    if (b === 'Z') {
      res += 6 + next(an);
    }
  }
  return res;
};
