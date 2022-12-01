export const part1 = (rows) => {
  let top = 0;
  let current = 0;
  for (let row of rows) {
    if (row === '') {
      if (current > top) {
        top = current;
      }
      current = 0;
      continue;
    }
    current += +row;
  }
  return top;
};

export const part2 = (rows) => {
  let counts = {};
  let current = 0;
  let idx = 0;
  for (let row of rows) {
    if (row === '') {
      counts[idx] = current;
      current = 0;
      idx += 1;
      continue;
    }
    current += +row;
  }
  return Object.values(counts)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, item) => {
      acc += item;
      return acc;
    }, 0);
};
