const fs = require('fs')
const path = require('path');

const SUM = 2020;

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(i => +i);

  const byNumber = {};

  for(let i = 0; i < arr.length; ++i) {
    const current = arr[i]
    byNumber[current] = 1;
    const possible = SUM - current;

    if (byNumber[possible] > 0) {
      console.log('A:', current, 'B:', possible, 'Product:', current * possible);
      break;
    }
  }

  for(let i = 0; i < arr.length; ++i) {
    for(let j = i + 1; j < arr.length; ++j) {
      const current = arr[i] + arr[j];
      const possible = SUM - current;
      if (byNumber[possible] > 0) {
        console.log('A:', arr[i], 'B:', arr[j], 'C:', possible, 'Product:', arr[i] * arr[j] * possible);
        break;
      }
    }
  }
}

main().catch(console.error)
