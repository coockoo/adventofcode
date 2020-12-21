const fs = require('fs');
const path = require('path');

const MAX_TURNS = [2020, 30000000];
// const MAX_TURNS = [2020];

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/,/g)
    .filter((i) => i)
    .map((raw) => {
      return +raw;
    });

  const turns = [];
  const cache = {};

  const maxTurn = Math.max(...MAX_TURNS);
  const maxTurns = {};

  let prevTurn = null;
  let turn = null;

  for (let i = 0; i < maxTurn; ++i) {
    prevTurn = turn;
    const prev = cache[prevTurn];
    const prevLen = prev?.length;

    if (arr[i] !== undefined) {
      turn = arr[i];
    } else if (prevLen === 1) {
      turn = 0;
    } else if (prevLen > 1) {
      turn = prev[prevLen - 1] - prev[prevLen - 2];
    }

    if (!cache[turn]) {
      cache[turn] = [i];
    } else {
      cache[turn] = [cache[turn][cache[turn].length - 1], i];
    }

    if (i + 1 === MAX_TURNS[0]) {
      maxTurns[MAX_TURNS[0]] = turn;
    }
    if (i + 1 === MAX_TURNS[1]) {
      maxTurns[MAX_TURNS[1]] = turn;
    }
    console.log('Turn %d. Number %d', i + 1, turn);
  }

  for (let i = 0; i < MAX_TURNS.length; ++i) {
    console.log('Part %d: %d', i + 1, maxTurns[MAX_TURNS[i]]);
  }
  // This program takes too long to finish
  //
  // 2020 = 755
  // 30000000 = 11962
}

main().catch(console.error);
