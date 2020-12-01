const fs = require('fs')
const path = require('path');

const SUM = 2020;

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i);

  const byNumber = {};

  for(let i = 0; i < arr.length; ++i) {
    const current = +arr[i]
    byNumber[current] = 1;

    if (byNumber[SUM - current] > 0) {
      console.log(i, current, SUM - current, current * (SUM - current));
      return;
    }
  }

  console.log('NO SUCH NUMBER')
}

main().catch(console.error)
