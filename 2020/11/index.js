const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  let arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return raw.split('');
    });

  const getNumOccupied = (i, j) => {
    let sides = {
      '-1:-1': [-1, -1],
      '-1:0': [-1, 0],
      '-1:1': [-1, 1],
      '0:-1': [0, -1],
      '0:1': [0, 1],
      '1:-1': [1, -1],
      '1:0': [1, 0],
      '1:1': [1, 1],
    };
    let occupied = 0;
    const max = Math.max(arr.length, arr[0].length) * 2;
    for (let k = 1; k < max; ++k) {
      Object.keys(sides).forEach((side) => {
        const [di, dj] = sides[side];
        if (arr[i + di * k]?.[j + dj * k] === '#') {
          occupied += 1;
          delete sides[side];
        }
        if (arr[i + di * k]?.[j + dj * k] === 'L') {
          delete sides[side];
        }
      });
    }
    return occupied;
  };

  const print = (arr) => {
    console.log(arr.map((i) => i.join('')).join('\n'));
  };

  for (let k = 0; k < 100; ++k) {
    let newArr = [];
    for (let i = 0; i < arr.length; ++i) {
      newArr[i] = [];
      for (let j = 0; j < arr[i].length; ++j) {
        if (arr[i][j] === '.') {
          newArr[i][j] = arr[i][j];
          continue;
        }
        const occupied = getNumOccupied(i, j);
        const o = occupied >= 5;
        const s = occupied >= 1;
        if (arr[i][j] === 'L' && !s) {
          newArr[i][j] = '#';
          continue;
        }
        if (arr[i][j] === '#' && o) {
          newArr[i][j] = 'L';
          continue;
        }
        newArr[i][j] = arr[i][j];
      }
    }
    arr = newArr;
  }

  print(arr);
  console.log(arr.flat().reduce((acc, i) => (acc += i === '#' ? 1 : 0), 0));
}

main().catch(console.error);
