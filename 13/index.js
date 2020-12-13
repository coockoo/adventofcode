const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  const split = content.split(/\n/g).filter((i) => i);
  let t = split[0];
  let arr = split[1]
    .split(/,/g)
    .map((i) => +i)
    .filter((i) => i)
    .sort((a, b) => a - b);

  let minWaitTime = 9999999;
  let busId = null;

  for (let i = 0; i < arr.length; ++i) {
    const current = arr[i];
    const waitTime = (Math.floor(t / current) + 1) * current - t;
    if (waitTime < minWaitTime) {
      minWaitTime = waitTime;
      busId = current;
    }
  }

  console.log('Answer 1:', minWaitTime * busId);

  arr = split[1]
    .split(/,/g)
    .map((i) => (i === 'x' ? 'x' : +i))
    .filter((i) => i);

  const M = arr.reduce((acc, item) => {
    if (item === 'x') {
      return acc;
    }
    acc *= item;
    return acc;
  }, 1);

  let sum = 0;
  let str = [];
  for (let i = 0; i < arr.length; ++i) {
    const m = arr[i];
    if (m === 'x') {
      continue;
    }
    str.push(`(n + ${i}) mod ${m} = 0`);

    const a = (10 * m - i) % m;
    const b = M / m;
    let b1 = 0;
    for (let j = 1; j <= b; ++j) {
      if ((b * j) % m === 1) {
        b1 = j;
        break;
      }
    }
    /*
    console.log('i', i);
    console.log('m', m);
    console.log('a', a);
    console.log('b', b);
    console.log('b % m', b % m);
    console.log("b'", b1);
    console.log();
    */
    sum += a * b * b1;
  }

  const res = sum % M;
  console.log('Answer 2:', res);

  console.log('Wolfram: ', str.join(', '));
  // Incorrect: 836024966345452
  // Incorrect: 836024966345394
  //   correct: 836024966345345
}

main().catch(console.error);
