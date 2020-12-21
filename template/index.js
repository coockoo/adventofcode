const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return {
        raw,
      };
    });

  let res = 0;

  console.log(res);
}

main().catch(console.error);
