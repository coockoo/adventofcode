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
  const start = Date.now();

  const logResult = (mode, res) => {
    const end = Date.now();
    const duration = end - start;
    const time = duration > 1000 ? (duration / 1000).toFixed(3) : duration;
    const metric = duration > 1000 ? 's' : 'ms';
    console.log('%s result: %s (%d%s)', mode, res, time, metric);
  };

  if (mode === 'part') {
    const res = await run('input');
    logResult(mode, res);
  } else if (mode === 'demo') {
    const res = await run('demo');
    logResult(mode, res);
  } else if (mode) {
    const res = await run(mode);
    logResult(mode, res);
  } else {
    const demoRes = await run('demo');
    logResult('demo', demoRes);
    const partRes = await run('input');
    logResult('part', partRes);
  }
};

main();
