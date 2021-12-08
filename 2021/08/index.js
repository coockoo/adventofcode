import { Matrix, Reducer } from '../../tools/index.js';

export const part1 = (rows) => {
  const arr = rows
    .flatMap((row) => {
      const [, right] = row.split('|');
      if (right) {
        return right.split(' ').filter(Boolean);
      }
    })
    .filter(Boolean);
  let res = 0;
  for (let i = 0; i < arr.length; ++i) {
    const item = arr[i];
    if (item.length === 2 || item.length === 3 || item.length === 4 || item.length === 7) {
      res += 1;
    }
  }
  return res;
};

const parse6 = (patterns) => {
  const four = patterns.find((p) => p.length === 4);
  const one = patterns.find((p) => p.length === 2);
  let zero = '';
  let six = '';
  let nine = '';

  patterns.forEach((pattern) => {
    if (pattern.length !== 6) {
      return;
    }
    const hasFour = four.split('').every((i) => pattern.split('').includes(i));
    if (hasFour) {
      nine = pattern;
      return;
    }
    const hasOne = one.split('').every((i) => pattern.split('').includes(i));
    if (hasOne) {
      zero = pattern;
      return;
    }

    six = pattern;
  });
  return [zero, six, nine];
};

const parse5 = (patterns) => {
  const one = patterns.find((p) => p.length === 2);

  let two = '';
  let three = '';
  let five = '';

  const [, six] = parse6(patterns);

  patterns.forEach((pattern) => {
    if (pattern.length !== 5) {
      return;
    }

    const hasOne = one.split('').every((i) => pattern.split('').includes(i));
    if (hasOne) {
      three = pattern;
      return;
    }

    const hasFive = pattern.split('').every((i) => six.split('').includes(i));
    if (hasFive) {
      five = pattern;
      return;
    }

    two = pattern;
  });
  return [two, three, five];
};

export const part2 = (rows) => {
  const arr = rows
    .map((row) => {
      const [left, right] = row.split('|');
      if (right) {
        return { left: left.split(' ').filter(Boolean), right: right.split(' ').filter(Boolean) };
      }
    })
    .filter(Boolean);

  let res = 0;

  for (let i = 0; i < arr.length; ++i) {
    const item = arr[i];
    const one = item.left.find((p) => p.length === 2);
    const four = item.left.find((p) => p.length === 4);
    const eight = item.left.find((p) => p.length === 7);
    const seven = item.left.find((p) => p.length === 3);
    const [zero, six, nine] = parse6(item.left);
    const [two, three, five] = parse5(item.left);

    const ordered = [zero, one, two, three, four, five, six, seven, eight, nine];

    let localRes = 0;
    for (let j = 0; j < item.right.length; ++j) {
      localRes *= 10;
      const k = ordered.findIndex((i) => i.split('').sort().join() === item.right[j].split('').sort().join());
      localRes += k;
    }
    res += localRes;
  }
  return res;
};
