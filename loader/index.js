import fs from 'fs';
import { CronJob } from 'cron';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async () => {
  const now = new Date();
  const day = `${now.getDate()}`;
  const year = `${now.getFullYear()}`;
  console.log(`getting input for ${year} ${day}`);

  const cookie = fs.readFileSync(path.resolve(__dirname, 'cookie.txt'), 'utf8').trim();
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      cookie,
    },
  });
  const input = await response.text();

  const pathToInput = path.resolve(__dirname, '..', year, day.padStart(2, '0'), 'input.txt');
  fs.writeFileSync(pathToInput, input.trim(), { flag: 'w' });
  console.log(`successfully written input to file ${pathToInput}`);
};

console.log('starting loader...');
new CronJob('30 0 7 1-25 Dec *', handler, null, true, 'Europe/Kiev');
console.log('loader started!');