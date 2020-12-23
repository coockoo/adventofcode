const fs = require('fs');
const path = require('path');

const MAX_CYCLES = 6;
const DIFF = [-1, 0, 1];

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return raw.split('');
    });

  if (arr.length % 2 === 0) {
    arr.forEach((line) => {
      line.push('.');
    });
    arr.push(getEmptyLine(arr.length + 1));
  }

  let cube = [arr];

  const size = arr.length;
  for (let i = 0; i < Math.floor(size / 2); ++i) {
    cube.unshift(getEmptySpace(size));
    cube.push(getEmptySpace(size));
  }

  for (let i = 0; i < MAX_CYCLES; ++i) {
    cube = getNextCube(cube);
  }

  console.log(cube.flat(2).filter((i) => i === '#').length);
}

function getNextCube(cube) {
  const eCube = expand(cube);
  const nextCube = expand(cube);

  const size = eCube.length;

  for (let z = 0; z < size; ++z) {
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        nextCube[z][y][x] = getNextState(eCube, z, y, x);
      }
    }
  }

  return nextCube;
}

function countActiveNeighbours(cube, z, y, x) {
  let count = 0;
  for (let i = 0; i < DIFF.length; ++i) {
    const dz = DIFF[i];
    for (let j = 0; j < DIFF.length; ++j) {
      const dy = DIFF[j];
      for (let k = 0; k < DIFF.length; ++k) {
        const dx = DIFF[k];
        if (dx === 0 && dy === 0 && dz === 0) {
          continue;
        }
        count += isActive(cube, z + dz, y + dy, x + dx) ? 1 : 0;
      }
    }
  }
  return count;
}

function getValue(cube, z, y, x) {
  return cube?.[z]?.[y]?.[x] || '.';
}

function isActive(cube, z, y, x) {
  const value = getValue(cube, z, y, x);
  return value === '#';
}

function getNextState(cube, z, y, x) {
  const isActiveCell = isActive(cube, z, y, x);
  const activeNeightbours = countActiveNeighbours(cube, z, y, x);
  return (isActiveCell && activeNeightbours === 2) || activeNeightbours === 3 ? '#' : '.';
}

function expand(cube) {
  const size = cube.length;
  const nextSize = size + 2;
  return [
    getEmptySpace(nextSize),
    ...cube.map((space) => {
      return [
        getEmptyLine(nextSize),
        ...space.map((line) => {
          return ['.', ...line, '.'];
        }),
        getEmptyLine(nextSize),
      ];
    }),
    getEmptySpace(nextSize),
  ];
}

function getEmptySpace(size) {
  return Array(size)
    .fill()
    .map(() => getEmptyLine(size));
}

function getEmptyLine(size) {
  return Array(size)
    .fill()
    .map(() => '.');
}

function print(cube) {
  cube.forEach((space) => {
    const separator = Array(space.length * 2 + 3)
      .fill()
      .map(() => '=')
      .join('');
    console.log(separator);
    console.log(space.map((i) => `| ${i.join(' ')} |`).join('\n'));
    console.log(separator);
  });
}

main().catch(console.error);
