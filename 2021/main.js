const fs = require('fs');
const path = require('path');

const [, , day, part] = process.argv;

if (!day) {
  throw new Error('day is required');
}
if (day.length !== 2) {
  throw new Error('day should be a double digit number');
}
if (!part) {
  throw new Error('part is required');
}
const PARTS = ['1', '2'];
if (!PARTS.includes(part)) {
  throw new Error(`part should be one of ["${PARTS.join('", "')}"]`);
}

const input = fs.readFileSync(path.resolve(__dirname, day, './input.txt'), 'utf8');
const rows = input.split(/\n/g);

const demoInput = fs.readFileSync(path.resolve(__dirname, day, './demo.txt'), 'utf8');
const demoRows = demoInput.split(/\n/g);

const handler = require(`./${day}`);

const demoRes = handler[`part${part}`](demoRows);
const res = handler[`part${part}`](rows);

console.log('Demo result:', demoRes);
console.log('Part result:', res);
