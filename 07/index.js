const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')

  const bags = {};

  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    if (raw.match(/no other bags.$/)) {
      return;
    }
    const match = raw.match(/^([a-z]+ [a-z]+) bags contain (\d+) ([a-z]+ [a-z]+) bags?(, (\d+) ([a-z]+ [a-z]+) bags?)?(, (\d+) ([a-z]+ [a-z]+) bags?)?(, (\d+) ([a-z]+ [a-z]+) bags?)?(, (\d+) ([a-z]+ [a-z]+) bags?)?(, (\d+) ([a-z]+ [a-z]+) bags?)?(, (\d+) ([a-z]+ [a-z]+) bags?)?/);

    for (let i = 3; i <= 100; i += 3) {
      if (!match[i]) {
        break;
      }

      if (!bags[match[i]]) {
        bags[match[i]] = []
      }

      bags[match[i]].push(match[1]);
    }
  });

  let visitedBags = [];

  let currentBags = [...bags['shiny gold']]
  let res = [...currentBags];


  while (currentBags.length) {
    const currentBag = currentBags.shift()

    if (currentBag === 'shiny gold') {
      continue;
    }

    if (visitedBags.indexOf(currentBag) >= 0) {
      continue;
    }
    visitedBags.push(currentBag);

    if (!bags[currentBag]) {
      continue;
    }

    res = [...res, ...bags[currentBag]]
    currentBags = [...currentBags, ...bags[currentBag]];
  }

  console.log([...new Set(res)].length);


  return;
}

main().catch(console.error);
