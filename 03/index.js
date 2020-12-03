const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    return {
      trees: raw.split(''),
      raw,
    };
  });

  let currentX = 0
  let treesCount = 0;
  for (let i = 0; i< arr.length; ++i) {
    if (arr[i].trees[currentX % arr[i].trees.length] === '#') {
      treesCount += 1;
    }
    currentX += 3;
  }

  console.log(treesCount);

  let treesProduct = treesCount;

  currentX = 0
  treesCount = 0;
  for (let i = 0; i< arr.length; ++i) {
    if (arr[i].trees[currentX % arr[i].trees.length] === '#') {
      treesCount += 1;
    }
    currentX += 1;
  }

  treesProduct *= treesCount;

  currentX = 0
  treesCount = 0;
  for (let i = 0; i< arr.length; ++i) {
    if (arr[i].trees[currentX % arr[i].trees.length] === '#') {
      treesCount += 1;
    }
    currentX += 5;
  }
  treesProduct *= treesCount;

  currentX = 0
  treesCount = 0;
  for (let i = 0; i< arr.length; ++i) {
    if (arr[i].trees[currentX % arr[i].trees.length] === '#') {
      treesCount += 1;
    }
    currentX += 7;
  }
  treesProduct *= treesCount;

  currentX = 0
  treesCount = 0;
  for (let i = 0; i< arr.length; i += 2) {
    if (arr[i].trees[currentX % arr[i].trees.length] === '#') {
      treesCount += 1;
    }
    currentX += 7;
  }
  treesProduct *= treesCount;


  console.log(treesProduct);
}

main().catch(console.error)
