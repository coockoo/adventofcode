import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const getVars = (rows, input) => {
  let vars = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i];
    if (!row) {
      continue;
    }
    let [cmd, v, value] = row.split(' ');
    if (cmd === 'inp') {
      const val = +input.shift();
      if (!val) {
        break;
      }
      vars[v] = val;
    }

    const r = vars[value] !== undefined ? +vars[value] : +value;

    if (cmd === 'add') {
      vars[v] += r;
    }

    if (cmd === 'mul') {
      vars[v] *= r;
    }

    if (cmd === 'div') {
      vars[v] = Math.floor(vars[v] / r);
    }

    if (cmd === 'mod') {
      vars[v] = vars[v] % r;
    }

    if (cmd === 'eql') {
      vars[v] = vars[v] === r ? 1 : 0;
    }
  }
  return vars;
};

export const part1 = (rows) => {
  const input = [9, 9, 9, 1, 1, 9, 9, 3, 9, 4, 9, 6, 8, 4];
  const key = input.join('');
  console.log(getVars(rows, input));
  return key;
};

export const part2 = (rows) => {
  const input = [6, 2, 9, 1, 1, 9, 4, 1, 7, 1, 6, 1, 1, 1];
  const key = input.join('');
  console.log(getVars(rows, input));
  return key;
};
/*
w1  = [6, 7, 8, 9]
w14 = [1, 2, 3, 4]

w2  = [2, 3, 4, 5, 6, 7, 8, 9]
w13 = [1, 2, 3, 4, 5, 6, 7, 8]

w3  = [9]
w4  = [1]

w5  = [1]
w6  = [9]

w7  = [4, 5, 6, 7, 8, 9]
w12 = [1, 2, 3, 4, 5, 6]

w8  = [1, 2, 3]
w9  = [7, 8, 9]

w10 = [1, 2, 3, 4]
w11 = [6, 7, 8, 9]
*/
