const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      const match = raw.match(/^([a-z]{3}) ([+-])(\d+)$/);
      return {
        op: match[1],
        sign: match[2] === '+' ? 1 : -1,
        value: +match[3],
      };
    });

  const visitedNodes = {};

  let acc = 0;
  let idx = 0;

  while (true) {
    if (visitedNodes[idx]) {
      break;
    }
    const node = arr[idx];
    visitedNodes[idx] = true;
    if (node.op === 'acc') {
      acc += node.sign * node.value;
      idx += 1;
    }
    if (node.op === 'nop') {
      idx += 1;
    }
    if (node.op === 'jmp') {
      idx += node.sign * node.value;
    }
  }

  console.log(acc);

  for (let i = 0; i < arr.length; ++i) {
    const visitedNodes = {};
    const newArr = arr.map((item, idx) => {
      if (idx === i) {
        return {
          ...item,
          op: item.op === 'jmp' ? 'nop' : item.op === 'nop' ? 'jmp' : item.op,
        };
      }
      return item;
    });

    let acc = 0;
    let idx = 0;

    while (true) {
      if (visitedNodes[idx] || idx === arr.length - 1) {
        break;
      }
      const node = newArr[idx];
      visitedNodes[idx] = true;
      if (node.op === 'acc') {
        acc += node.sign * node.value;
        idx += 1;
      }
      if (node.op === 'nop') {
        idx += 1;
      }
      if (node.op === 'jmp') {
        idx += node.sign * node.value;
      }
    }

    if (idx === arr.length - 1) {
      console.log(acc);
      break;
    }
  }
}

main().catch(console.error);
