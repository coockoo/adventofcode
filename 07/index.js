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

    if (!bags[match[1]]) {
      bags[match[1]] = {}
    }

    for (let i = 3; i <= 100; i += 3) {
      if (!match[i]) {
        break;
      }

      bags[match[1]][match[i]] = +match[i - 1];
    }
  });

  function calc(key) {
    const bag = bags[key];
    if (!bag) {
      return 0;
    }

    const keys = Object.keys(bag);

    return keys.reduce((acc, bagKey) => {
      const childCalcRes = calc(bagKey)
      console.log(key, bagKey, bag[bagKey], childCalcRes);
      acc += bag[bagKey] + bag[bagKey] * childCalcRes;
      return acc;
    }, 0);
  }

  console.log(calc('shiny gold'))
}

main().catch(console.error);
