const solve = ([row], length) => {
  for (let i = 0; i < row.length; ++i) {
    const counts = {};
    for (let j = i; j < i + length; ++j) {
      counts[row[j]] = true;
    }
    if (Object.keys(counts).length === length) {
      return i + length;
    }
  }
};

export const part1 = (rows) => solve(rows, 4);
export const part2 = (rows) => solve(rows, 14);
