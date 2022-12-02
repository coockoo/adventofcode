export const part1 = (rows) => {
  let res = 0;
  for (const idx in rows) {
    const row = rows[idx];
    if (!row) {
      continue;
    }
    const [a, b] = row.split(' ');
    const bn = b === 'X' ? 1 : b === 'Y' ? 2 : 3;
    res += bn;
    if ((a === 'A' && b === 'Y') || (a === 'B' && b === 'Z') || (a === 'C' && b === 'X')) {
      res += 6;
    }
    if ((a === 'A' && b === 'X') || (a === 'B' && b === 'Y') || (a === 'C' && b === 'Z')) {
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
    const an = a === 'A' ? 1 : a === 'B' ? 2 : 3;
    if (b === 'X') {
      const t = an - 1;
      res += t <= 0 ? 3 : t;
    }
    if (b === 'Y') {
      res += 3 + an;
    }
    if (b === 'Z') {
      const t = an + 1;
      res += 6 + (t > 3 ? 1 : t);
    }
  }
  return res;
};
