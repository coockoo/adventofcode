const fs = require('fs');
const path = require('path');

const MAX_CYCLES = 6;
const DIFF = [-1, 0, 1];

function getValue(cube, coordinates) {
  const key = coordinates.join(',');
  if (cube[key] === undefined) {
    cube[key] = false;
  }
  return cube[key];
}

function setValue(cube, coordinates, value) {
  const key = coordinates.join(',');
  cube[key] = value;
}

function getNeighbours(cube, coordinates) {
  const offsets = getOffsets(coordinates.length);
  return offsets.map((offset) => {
    const neighbourCoordinates = coordinates.map((c, i) => c + offset[i]);
    const value = getValue(cube, neighbourCoordinates);
    return value;
  });
}

const offsetsCache = { 0: [[]] };
function getOffsets(dimensions) {
  if (!offsetsCache[dimensions]) {
    const prevOffsets = getOffsets(dimensions - 1);
    const offsets = [];
    DIFF.forEach((diff) => {
      prevOffsets.forEach((offset) => {
        const newOffset = [...offset, diff];
        offsets.push(newOffset);
      });
    });
    offsetsCache[dimensions] = offsets;
  }

  return offsetsCache[dimensions];
}

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return raw.split('');
    });

  const dimensions = 3;

  const res1 = getForDimensions(arr, 3);
  console.log('Part 1: %d', res1);
  const res2 = getForDimensions(arr, 4);
  console.log('Part 2: %d', res2);
}

function getForDimensions(arr, dimensions) {
  let cube = {};
  arr.forEach((row, x) => {
    row.forEach((value, y) => {
      setValue(cube, [x, y, ...Array(dimensions - 2).fill(0)], value === '#');
    });
  });

  for (let i = 0; i < MAX_CYCLES; ++i) {
    const newCube = { ...cube };
    Object.keys(cube).forEach((key) => {
      const coordinates = key.split(',').map((i) => +i);
      const offsets = getOffsets(coordinates.length);
      offsets.forEach((offset) => {
        const newCoordinates = coordinates.map((c, i) => c + offset[i]);
        const value = getValue(cube, newCoordinates);
        let count = getNeighbours(cube, newCoordinates).filter((i) => i).length;
        count -= value ? 1 : 0; // delete if cell is active
        setValue(newCube, newCoordinates, (value && count === 2) || count === 3);
      });
    });
    cube = newCube;
  }
  return Object.values(cube).filter((i) => i).length;
}

main().catch(console.error);
