import { resolve } from 'path';

const inc = (sizes, path, size) => {
  sizes[path] = (sizes[path] || 0) + size;
  if (path === '/') {
    return;
  }
  const parent = resolve(path, '..');
  inc(sizes, parent, size);
};

const getSizes = (rows) => {
  let current = '/';
  const sizes = {};
  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (row.startsWith('$ cd')) {
      const path = row.slice(5);
      current = resolve(current, path);
    }
    const match = row.match(/^(\d+) .+$/);
    if (match) {
      const [_, size] = match;
      inc(sizes, current, +size);
    }
  }
  return sizes;
};

export const part1 = (rows) => {
  const sizes = getSizes(rows);
  let res = 0;
  for (let size of Object.values(sizes)) {
    if (size < 100000) {
      res += size;
    }
  }
  return res;
};

export const part2 = (rows) => {
  const sizes = getSizes(rows);
  const threshold = sizes['/'] - 40000000;
  let res = 0;
  const arr = Object.values(sizes).sort((a, b) => a - b);
  for (let i of arr) {
    if (i >= threshold) {
      res = i;
      break;
    }
  }
  return res;
};
