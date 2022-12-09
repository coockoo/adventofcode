const lv = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = 0; k < col; ++k) {
    const key = `${row}-${k}`;
    if (trees[key] >= trees[t]) {
      return false;
    }
  }
  return true;
};

const rv = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = col + 1; k < cc; ++k) {
    const key = `${row}-${k}`;
    if (trees[key] >= trees[t]) {
      return false;
    }
  }
  return true;
};

const tv = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = 0; k < row; ++k) {
    const key = `${k}-${col}`;
    if (trees[key] >= trees[t]) {
      return false;
    }
  }
  return true;
};

const bv = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = row + 1; k < rc; ++k) {
    const key = `${k}-${col}`;
    if (trees[key] >= trees[t]) {
      return false;
    }
  }
  return true;
};

const ld = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = col - 1; k >= 0; --k) {
    const key = `${row}-${k}`;
    if (trees[key] >= trees[t]) {
      return col - k;
    }
  }
  return col;
};

const rd = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = col + 1; k < cc; ++k) {
    const key = `${row}-${k}`;
    if (trees[key] >= trees[t]) {
      return k - col;
    }
  }
  return cc - col - 1;
};

const td = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = row - 1; k >= 0; --k) {
    const key = `${k}-${col}`;
    if (trees[key] >= trees[t]) {
      return row - k;
    }
  }
  return row;
};

const bd = (trees, row, col, rc, cc) => {
  const t = `${row}-${col}`;
  for (let k = row + 1; k < rc; ++k) {
    const key = `${k}-${col}`;
    if (trees[key] >= trees[t]) {
      return k - row;
    }
  }
  return rc - row - 1;
};

export const part1 = (rows) => {
  let res = 0;
  let f = {};
  const rc = rows.length;
  const cc = rows[0].length;
  for (let row in rows) {
    const trees = rows[row].split('');
    for (let col in trees) {
      const tree = trees[col];
      const key = `${row}-${col}`;
      f[key] = tree;
    }
  }

  for (let row in rows) {
    const trees = rows[row].split('');
    for (let col in trees) {
      const l = lv(f, +row, +col, rc, cc);
      const r = rv(f, +row, +col, rc, cc);
      const t = tv(f, +row, +col, rc, cc);
      const b = bv(f, +row, +col, rc, cc);
      if (l || r || t || b) {
        res += 1;
      }
    }
  }
  return res;
};

export const part2 = (rows) => {
  rows = rows.filter((r) => r);
  let res = 0;
  let f = {};
  const rc = rows.length;
  const cc = rows[0].length;
  for (let row in rows) {
    const trees = rows[row].split('');
    for (let col in trees) {
      const tree = trees[col];
      const key = `${row}-${col}`;
      f[key] = tree;
    }
  }

  for (let row in rows) {
    const trees = rows[row].split('');
    for (let col in trees) {
      const l = ld(f, +row, +col, rc, cc);
      const r = rd(f, +row, +col, rc, cc);
      const t = td(f, +row, +col, rc, cc);
      const b = bd(f, +row, +col, rc, cc);
      const score = l * r * t * b;
      res = Math.max(res, score);
    }
  }
  return res;
};
