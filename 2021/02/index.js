export const part1 = (rows) => {
  let position = 0;
  let depth = 0;
  for (let i = 0; i < rows.length; ++i) {
    const [direction, amount] = rows[i].split(' ');
    if (direction === 'forward') {
      position += +amount;
    }
    if (direction === 'up') {
      depth -= +amount;
    }
    if (direction === 'down') {
      depth += +amount;
    }
  }
  return position * depth;
};

export const part2 = (rows) => {
  let position = 0;
  let depth = 0;
  let aim = 0;
  for (let i = 0; i < rows.length; ++i) {
    const [direction, amount] = rows[i].split(' ');
    if (direction === 'forward') {
      position += +amount;
      depth += +amount * aim;
    }
    if (direction === 'up') {
      aim -= +amount;
    }
    if (direction === 'down') {
      aim += +amount;
    }
  }
  return position * depth;
};
