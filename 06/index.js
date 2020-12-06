const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')

  let res = 0;
  let firstRes = 0;
  let currentCounts = {}
  let currentGroup = 0;

  content.split(/\n/g).map(raw => {
    if (raw) {
      currentGroup += 1;
      raw.trim().split('').forEach(i => {
        currentCounts[i] = (currentCounts[i] || 0) + 1;
      })
      return;
    }
    if (!raw) {
      let localRes = 0;
      Object.values(currentCounts).map((value) => {
        if (value === currentGroup) {
          localRes += 1
        }
      })
      firstRes += Object.keys(currentCounts).length
      res += localRes
      currentCounts = {}
      currentGroup = 0;
      return;
    }
  });

  console.log(firstRes);
  console.log(res);
}

main().catch(console.error);
