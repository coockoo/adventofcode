export const fromNumeric = (rows, options = {}) => {
  let { sep = '' } = options;

  const items = [];
  const size = rows[0].length;

  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (row.length) {
      items.push(...row.split(sep).map((i) => +i));
    }
  }

  return createMatrix(items, size);
};

export const fillSquare = (size, initialValue) => {
  const items = new Array(Math.pow(size, 2)).fill(initialValue);
  return createMatrix(items, size);
};

export const createMatrix = (initialItems, initialSize) => {
  let items = [...initialItems];
  let size = initialSize;

  const to2D = () => {
    const res = [];
    for (let i = 0, j = items.length; i < j; i += size) {
      res.push(items.slice(i, i + size));
    }
    return res;
  };

  const toString = () => {
    const maxLen = Math.max(...items.map((i) => `${i}`.length));
    return to2D()
      .map((row) => row.map((i) => `${i}`.padStart(maxLen, ' ')).join(' '))
      .join('\n');
  };

  const incAll = (amount = 1) => {
    for (let i = 0; i < items.length; ++i) {
      items[i] += amount;
    }
  };

  const isIn = (row, col) => {
    return row >= 0 && col >= 0 && col < size && row < items.length / size;
  };

  const getItem = (row, col) => {
    if (!isIn(row, col)) {
      return undefined;
    }
    return items[row * size + col];
  };

  const setItem = (row, col, value) => {
    if (!isIn(row, col)) {
      return;
    }
    items[row * size + col] = value;
  };

  const incItem = (row, col, amount = 1) => {
    setItem(row, col, getItem(row, col) + amount);
  };

  const getItems = () => {
    return items;
  };

  return {
    to2D,
    incAll,
    toString,
    isIn,
    getItem,
    setItem,
    incItem,
    getItems,
  };
};

export const NEIGHBOURS_8 = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
