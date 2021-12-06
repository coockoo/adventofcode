export const part1 = (rows) => {
  const arr = rows.map(Number);
  let res = 0;
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i] > arr[i - 1]) {
      res += 1;
    }
  }
  return res;
};

export const part2 = (rows) => {
  const arr = rows.map(Number);
  let res = 0;
  let window = arr[0] + arr[1] + arr[2];
  for (let i = 3; i < arr.length; ++i) {
    const newWindow = window + arr[i] - arr[i - 3];
    if (newWindow > window) {
      res += 1;
    }
    window = newWindow;
  }
  return res;
};
