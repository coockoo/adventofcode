const fs = require('fs');
const path = require('path');

const TREE_SYMBOL = '#';
const shiftsY = [1,1,1,1,2];
const shiftsX = [1,3,5,7,1];

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    return {
      trees: raw.split(''),
      raw,
    };
  });

  const rowSize = arr[0].trees.length;

  const treesCount = {}
  const addTree = (x, y) => {
    if (!treesCount[y]) {
      treesCount[y] = {}
    }
    if (!treesCount[y][x]) {
      treesCount[y][x] = 0
    }
    treesCount[y][x] += 1;
  }
  for (let y = 0; y < arr.length; y += 1) {
    for (let i = 0; i < shiftsY.length; i += 1) {
      const shiftY = shiftsY[i]
      const shiftX = shiftsX[i];
      const x = (y * shiftX) % rowSize;
      if (y * shiftY < arr.length && arr[y * shiftY].trees[x] === TREE_SYMBOL) {
        addTree(shiftX, shiftY)
      }
    }
  }

  let product = 1;
  Object.keys(treesCount).map(y => {
    Object.keys(treesCount[y]).map(x => {
      console.log(`Trees for slope Right ${x}, Down ${y}: ${treesCount[y][x]}`)
      product *= treesCount[y][x];
    });
  });

  console.log(`Total product of all slopes: ${product}`);
}

main().catch(console.error)
