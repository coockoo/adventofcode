const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  let mask = '';
  let mem = {};

  content
    .split(/\n/g)
    .filter((i) => i)
    .forEach((raw) => {
      const maskMatch = raw.match(/^mask = (.+)$/);
      if (maskMatch) {
        mask = maskMatch[1];
        return;
      }

      const memMatch = raw.match(/^mem\[(\d+)\] = (\d+)$/);
      if (memMatch) {
        const key = memMatch[1];
        const value = memMatch[2];

        const binValue = toBinary(value);
        const binValueWithMask = applyMask(binValue, mask);

        console.log(binValue);
        console.log(mask);
        console.log(binValueWithMask);
        console.log(''.padStart(36, '='));

        const valueWithMask = toDecimal(binValueWithMask);

        mem[key] = valueWithMask;
      }
    });

  const res = Object.values(mem).reduce((acc, i) => {
    acc += i;
    return acc;
  }, 0);

  console.log('Part 1: %d', res);
}

function toBinary(value) {
  return (value >>> 0).toString(2).padStart(36, '0');
}

function toDecimal(value) {
  return parseInt(value, 2);
}

function applyMask(bin, mask) {
  return bin
    .split('')
    .map((_, i) => {
      return mask[i] === 'X' ? bin[i] : mask[i];
    })
    .join('');
}

main().catch(console.error);
