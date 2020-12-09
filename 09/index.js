const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  let preamble = [];
  let arr = [];
  let weakness = 0;

  content
    .split(/\n/g)
    .filter((i) => i)
    .forEach((raw, i) => {
      arr.push(+raw);
      if (i < 25) {
        preamble.push(+raw);
        return;
      }
      let current = +raw;
      let found = false;
      for (let j = 0; j < preamble.length; ++j) {
        if (preamble[j] > current) {
          continue;
        }
        const idx = preamble.indexOf(current - preamble[j]);
        if (idx >= 0 && idx !== j) {
          found = true;
          break;
        }
      }
      if (!found) {
        console.log('FOUND', i, current);
        weakness = current;
      }
      preamble.shift();
      preamble.push(current);
    });

  let idx = 0;
  let shift = 0;
  let currentSum = 0;

  while (true) {
    if (currentSum === weakness && shift > 0) {
      const sorted = arr.slice(idx, idx + shift).sort();
      console.log('FOUND', sorted[0] + sorted[sorted.length - 1]);
      break;
    }
    if (currentSum > weakness) {
      currentSum = 0;
      shift = 0;
      idx += 1;
    }

    currentSum += arr[idx + shift];
    shift += 1;
  }
}

main().catch(console.error);
