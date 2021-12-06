export const part1 = (rows) => {
  let gamma = 0;
  let epsilon = 0;

  let counters = [];

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    const bits = row.split('');
    for (let j = 0; j < bits.length; ++j) {
      const bit = bits[j];
      if (!counters[j]) {
        counters[j] = {};
      }
      if (!counters[j][bit]) {
        counters[j][bit] = 0;
      }
      counters[j][bit] += 1;
    }
  }

  for (let i = counters.length - 1; i >= 0; --i) {
    gamma += counters[i]['1'] > counters[i]['0'] ? Math.pow(2, counters.length - 1 - i) : 0;
    epsilon += counters[i]['0'] > counters[i]['1'] ? Math.pow(2, counters.length - 1 - i) : 0;
  }
  return gamma * epsilon;
};

export const part2 = (rows) => {
  let oxygenRows = [...rows];
  let index = 0;
  while (oxygenRows.length > 1) {
    let counters = {};

    for (let i = 0; i < oxygenRows.length; ++i) {
      const row = oxygenRows[i];
      const bits = row.split('');
      const bit = bits[index];
      if (!counters[bit]) {
        counters[bit] = [];
      }
      counters[bit].push(row);
    }

    if ((counters['0']?.length || 0) > (counters['1']?.length || 0)) {
      oxygenRows = counters['0'];
    } else {
      oxygenRows = counters['1'];
    }
    index += 1;
  }

  let carbonRows = [...rows];
  index = 0;
  while (carbonRows.length > 1) {
    let counters = {};

    for (let i = 0; i < carbonRows.length; ++i) {
      const row = carbonRows[i];
      const bits = row.split('');
      const bit = bits[index];
      if (!counters[bit]) {
        counters[bit] = [];
      }
      counters[bit].push(row);
    }

    if ((counters['1']?.length || 0) < (counters['0']?.length || 0)) {
      carbonRows = counters['1'];
    } else {
      carbonRows = counters['0'];
    }
    index += 1;
  }

  return toDecimal(oxygenRows[0]) * toDecimal(carbonRows[0]);
};

const toDecimal = (binary) => {
  let res = 0;
  for (let i = 0; i < binary.length; ++i) {
    if (+binary[i] === 1) {
      res += Math.pow(2, binary.length - 1 - i);
    }
  }
  return res;
};
