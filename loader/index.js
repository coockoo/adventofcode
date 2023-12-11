import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async () => {
  const now = new Date();
  const year = process.argv[2] || `${now.getFullYear()}`;
  const day = process.argv[3] || `${now.getDate()}`;
  console.log(`getting input for ${year} ${day}`);

  let cookie = await fs.readFile(path.resolve(__dirname, 'cookie.txt'), 'utf8');
  cookie = cookie.trim();
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      cookie,
    },
  });
  const input = await response.text();

  const dir = path.resolve(__dirname, '..', year, day.padStart(2, '0'));
  await fs.mkdir(dir, { recursive: true });
  const pathToInput = path.resolve(dir, 'input.txt');
  await fs.writeFile(pathToInput, input, { flag: 'w' });
  console.log(`successfully written input to file ${pathToInput}`);
};

await handler();
