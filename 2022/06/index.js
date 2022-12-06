const solve = (rows, length) => {
  const row = rows[0];
  for (let i = 0; i < row.length; ++i) {
    const counts = {};
    const t = row.slice(i, i + length);
    for (let j = 0; j < t.length; ++j) {
      counts[t[j]] = (counts[t[j]] || 0) + 1;
      if (counts[t[j]] > 1) {
        break;
      }
    }
    const isOne = Object.values(counts).every((i) => i === 1);
    if (isOne) {
      return i + length;
    }
  }
};
export const part1 = (rows) => solve(rows, 4);
export const part2 = (rows) => solve(rows, 14);
