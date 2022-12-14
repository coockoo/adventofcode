const compare = (a, b) => {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    if (a < b) {
      return 'right';
    }
    if (a > b) {
      return 'not';
    }
    if (a === b) {
      return;
    }
  }

  if (Array.isArray(a) && Array.isArray(b) && !a.length && !b.length) {
    return;
  }

  if (Array.isArray(a) && !a.length) {
    return 'right';
  }

  if (Array.isArray(b) && !b.length) {
    return 'not';
  }

  const [fa, ...ra] = Array.isArray(a) ? a : [a];
  const [fb, ...rb] = Array.isArray(b) ? b : [b];

  const fr = compare(fa, fb);
  if (fr) {
    return fr;
  }

  return compare(ra, rb);
};

export const part1 = (rows) => {
  let res = 0;
  for (let i = 0; i < rows.length; i += 3) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const left = eval(rows[i]);
    const right = eval(rows[i + 1]);

    const cr = compare(left, right);

    if (cr === 'right') {
      res += i / 3 + 1;
    }
  }
  return res;
};

export const part2 = (rows) => {
  let packets = [[[2]], [[6]]];
  for (let i = 0; i < rows.length; i += 3) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const left = eval(rows[i]);
    const right = eval(rows[i + 1]);
    packets.push(left);
    packets.push(right);
  }
  packets = packets.sort((a, b) => {
    const cr = compare(a, b);
    return cr === 'right' ? -1 : cr === 'not' ? 1 : 0;
  });
  let res = 1;
  for (const i in packets) {
    const p = packets[i];
    if (p.length === 1 && p[0].length === 1 && (p[0][0] === 2 || p[0][0] === 6)) {
      res *= +i + 1;
    }
  }
  return res;
};
