import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const run = async (filename) => {
  const input = fs.readFileSync(path.resolve(__dirname, day, `./${filename}.txt`), 'utf8');
  const rows = input.split(/\n/g);
  const handler = await import(`./${day}/index.js`);
  const res = handler[`part${part}`](rows);
  return res;
};

const main = async () => {
  if (mode === 'part') {
    const res = await run('input');
    console.log(`${mode} result: `, res);
  } else if (mode === 'demo') {
    const res = await run('demo');
    console.log(`${mode} result: `, res);
  } else {
    const demoRes = await run('demo');
    console.log('demo result: ', demoRes);
    const partRes = await run('input');
    console.log('part result: ', partRes);
  }
};

main();
