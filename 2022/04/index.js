const parseRow = (row) => {
  const parts = row.split(',');
  const [left, right] = parts;
  const [a1, b1] = left.split('-').map((i) => +i);
  const [a2, b2] = right.split('-').map((i) => +i);
  return { a1, b1, a2, b2 };
};

export const part1 = (rows) => {
  let res = 0;
  for (let i in rows) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    const { a1, b1, a2, b2 } = parseRow(row);

    if ((a1 <= a2 && b1 >= b2) || (a2 <= a1 && b2 >= b1)) {
      res += 1;
    }
  }
  return res;
};

export const part2 = (rows) => {
  let res = 0;
  for (let i in rows) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    const { a1, b1, a2, b2 } = parseRow(row);
    if (b1 < a2 || b2 < a1) {
      continue;
    }
    res += 1;
  }
  return res;
};
