const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  let rules = {};
  let words = [];

  content
    .split(/\n/g)
    .filter((i) => i)
    .forEach((raw) => {
      const ruleMatch = raw.match(/(\d+): (.+)/);
      if (ruleMatch) {
        const [_, key, value] = ruleMatch;
        const letterMatch = value.match(/"([ab])"/);
        if (letterMatch) {
          rules[key] = letterMatch[1];
        } else {
          rules[key] = value.split('|').map((i) => i.split(' ').filter((i) => i));
        }
      }
      const wordMatch = raw.match(/^([ab]+)$/);
      if (wordMatch) {
        const [_, word] = wordMatch;
        words.push(word);
      }
    });

  const cache = {};

  const getWords = (ruleId, level = 0) => {
    console.log('CACHE SIZE', Object.keys(cache).length, '/', Object.keys(rules).length);
    const tab = new Array(level)
      .fill()
      .map(() => '')
      .join(' ');
    console.log(`${tab}Rule ${ruleId}`);
    if (!cache[ruleId]) {
      const options = rules[ruleId];
      if (options === 'a' || options === 'b') {
        cache[ruleId] = [[options]];
      } else {
        console.log(`${tab}Calculating ${ruleId}`);
        const ruleRes = [];
        options.forEach((option) => {
          let optionRes = [[]];
          option.forEach((rid) => {
            console.log(`${tab}Inner Rule ${rid}`);
            const words = getWords(rid, level + 1);
            const newOptionRes = [];
            for (let i = 0; i < words.length; ++i) {
              const word = words[i];
              for (let j = 0; j < optionRes.length; ++j) {
                const r = optionRes[j];
                newOptionRes.push([...r, ...word]);
              }
            }
            optionRes = newOptionRes;
          });
          for (let i = 0; i < optionRes.length; ++i) {
            ruleRes.push(optionRes[i]);
          }
        });
        cache[ruleId] = ruleRes;
      }
    } else {
      console.log(`${tab}Using cache ${ruleId}`);
    }
    return cache[ruleId];
  };

  const rule0 = getWords('0').map((i) => i.join(''));
  const part1 = words.reduce((acc, word) => {
    rule0.forEach((rule) => {
      if (rule === word) {
        acc += 1;
      }
    });
    return acc;
  }, 0);

  console.log('Part 1: %d', part1);
}

main().catch(console.error);
