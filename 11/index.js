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

  const areNeighboursOccupied = (i, j) => {
    const sum =
      (arr[i - 1]?.[j - 1] === '#' ? 1 : 0) +
      (arr[i - 1]?.[j] === '#' ? 1 : 0) +
      (arr[i - 1]?.[j + 1] === '#' ? 1 : 0) +
      (arr[i][j - 1] === '#' ? 1 : 0) +
      (arr[i][j + 1] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j - 1] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j + 1] === '#' ? 1 : 0);
    return sum >= 4;
  };

  const hasSomeOccupied = (i, j) => {
    const sum =
      (arr[i - 1]?.[j - 1] === '#' ? 1 : 0) +
      (arr[i - 1]?.[j] === '#' ? 1 : 0) +
      (arr[i - 1]?.[j + 1] === '#' ? 1 : 0) +
      (arr[i][j - 1] === '#' ? 1 : 0) +
      (arr[i][j + 1] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j - 1] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j] === '#' ? 1 : 0) +
      (arr[i + 1]?.[j + 1] === '#' ? 1 : 0);
    return sum >= 1;
  };

  const print = (arr) => {
    console.log(arr.map((i) => i.join('')).join('\n'));
  };

  for (let k = 0; k < 1000; ++k) {
    let newArr = [];
    for (let i = 0; i < arr.length; ++i) {
      newArr[i] = [];
      for (let j = 0; j < arr[i].length; ++j) {
        if (arr[i][j] === '.') {
          newArr[i][j] = arr[i][j];
          continue;
        }
        const o = areNeighboursOccupied(i, j);
        const s = hasSomeOccupied(i, j);
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
    print(arr);
    console.log('\n');
  }

  console.log(arr.flat().reduce((acc, i) => (acc += i === '#' ? 1 : 0), 0));
}

main().catch(console.error);
