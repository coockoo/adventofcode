const fs = require('fs')
const path = require('path');

const SUM = 2020;

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i);

  const byNumber = {}
  arr.forEach(item => {
    byNumber[item] = true;
  });

  for(let i = 0; i < arr.length; ++i) {
    const current = +arr[i]
    if (byNumber[SUM - current]) {
      console.log(i, current, SUM - current, current * (SUM - current));
      return;
    }
  }

  console.log('NO SUCH NUMBER')
}

main().catch(console.error)
