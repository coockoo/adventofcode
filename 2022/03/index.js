const getPriority = (char) => {
  const code = char.charCodeAt(0);
  return char.match(/[a-z]/) ? code - 'a'.charCodeAt(0) + 1 : code - 'A'.charCodeAt(0) + 27;
};

export const part1 = (rows) => {
  let res = 0;
  for (let i in rows) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    const l = row.length / 2;
    const first = row.slice(0, l).split('');
    const second = row.slice(l).split('');
    let r = '';
    for (let k of first) {
      if (second.includes(k)) {
        r = k;
        break;
      }
    }
    res += getPriority(r);
  }
  return res;
};

export const part2 = (rows) => {
  let res = 0;
  for (let i = 0; i < rows.length; i += 3) {
    const t = rows.slice(i, i + 3);
    if (t.length !== 3) {
      continue;
    }
    const first = t[0].split('');
    const second = t[1].split('');
    const third = t[2].split('');
    let r = '';
    for (let k of first) {
      if (second.includes(k) && third.includes(k)) {
        r = k;
        break;
      }
    }
    res += getPriority(r);
  }
  return res;
};
