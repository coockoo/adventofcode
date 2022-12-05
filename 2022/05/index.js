const moveByOne = (rf, rt, amount) => {
  for (let i = 0; i < amount; ++i) {
    const t = rf.pop();
    rt.push(t);
  }
};

const moveStack = (rf, rt, amount) => {
  const toInsert = rf.splice(-amount);
  rt.push(...toInsert);
};

const solve = (moveFn, rows) => {
  let res = [];

  const r = {};
  for (let j = 0; j < 10; ++j) {
    r[j] = [];
  }

  for (let i in rows) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    if (row.startsWith('move')) {
      const [amount, from, to] = row.match(/(\d+)/g);
      moveFn(r[+from], r[+to], +amount);
      continue;
    }
    if (row.includes('[')) {
      for (let j = 0; j < row.length; ++j) {
        const k = row[j * 4 + 1];
        if (k && k !== ' ') {
          r[j + 1].unshift(k);
        }
      }
      continue;
    }
  }
  for (let i = 0; i < 10; ++i) {
    res.push(r[i][r[i].length - 1] || '');
  }
  return res.join('');
};

export const part1 = (rows) => solve(moveByOne, rows);
export const part2 = (rows) => solve(moveStack, rows);
