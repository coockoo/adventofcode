const getResValue = (cycle, value) => {
  if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
    return cycle * value;
  }
  return 0;
};
export const part1 = (rows) => {
  let res = 0;
  let cycle = 1;
  let value = 1;
  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const match = row.match(/^addx (.+)$/);
    if (match) {
      cycle += 1;
      res += getResValue(cycle, value);
      const [_, amount] = match;
      value += +amount;
    }
    cycle += 1;
    res += getResValue(cycle, value);
  }
  return res;
};

export const part2 = (rows) => {
  let sprite = [0, 1, 2];
  const res = {};
  let cycle = 1;

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    res[cycle - 1] = sprite.includes((cycle - 1) % 40);
    const match = row.match(/^addx (.+)$/);
    if (match) {
      cycle += 1;
      res[cycle - 1] = sprite.includes((cycle - 1) % 40);
      const [_, amount] = match;
      sprite = sprite.map((i) => i + +amount);
    }
    cycle += 1;
  }
  return getResImg(res);
};

const getResImg = (res) => {
  const d = [''];
  for (let i = 0; i < 6; ++i) {
    const r = [];
    for (let j = 0; j < 40; ++j) {
      r.push(res[i * 40 + j] ? '#' : '.');
    }
    d.push(r.join(''));
  }
  d.push('');
  return d.join('\n');
};
