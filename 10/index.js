const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return +raw;
    })
    .sort((a, b) => a - b);

  arr.unshift(0);
  arr.push(arr[arr.length - 1] + 3);

  let ones = 0;
  let twos = 0;
  let threes = 0;

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i + 1] - arr[i] === 1) {
      ones += 1;
    }
    if (arr[i + 1] - arr[i] === 2) {
      twos += 1;
    }
    if (arr[i + 1] - arr[i] === 3) {
      threes += 1;
    }
  }

  let tree = {};
  for (let i = 0; i < arr.length; ++i) {
    tree[arr[i]] = [];
    if (tree[arr[i] - 1]) {
      tree[arr[i] - 1].push(arr[i]);
    }
    if (tree[arr[i] - 2]) {
      tree[arr[i] - 2].push(arr[i]);
    }
    if (tree[arr[i] - 3]) {
      tree[arr[i] - 3].push(arr[i]);
    }
  }

  let counts = {
    0: 1,
  };
  let p = [0];

  // console.log(tree);
  for (let i = 0; i < arr.length - 1; ++i) {
    const current = arr[i];
    if (!tree[current]) {
      continue;
    }

    tree[current].forEach((next) => {
      counts[next] = (counts[next] || 0) + counts[current];
    });
    delete counts[current];
  }

  console.log('One diffs: %d', ones);
  console.log('Two diffs: %d', twos);
  console.log('Three diffs: %d', threes);
  console.log('One diffs x Three diffs: %d', ones * threes);
  console.log('Different possibilities: %d', counts[arr[arr.length - 1]]);
}

main().catch(console.error);
