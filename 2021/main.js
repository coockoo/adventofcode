const fs = require('fs');
const path = require('path');

const [, , day, part, mode] = process.argv;

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

const handler = require(`./${day}`);

const run = (filename) => {
  const input = fs.readFileSync(path.resolve(__dirname, day, `./${filename}.txt`), 'utf8');
  const rows = input.split(/\n/g);
  const res = handler[`part${part}`](rows);
  return res;
};

if (mode === 'part') {
  const res = run('input');
  console.log(`${mode} result: `, res);
} else if (mode === 'demo') {
  const res = run('demo');
  console.log(`${mode} result: `, res);
} else {
  const demoRes = run('demo');
  console.log('demo result: ', demoRes);
  const partRes = run('input');
  console.log('part result: ', partRes);
}
