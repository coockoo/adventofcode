const fs = require('fs');
const path = require('path');

const ROW_SIZE = 8;

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i);

  let maxSeatId = 0;
  let minSeatId = 9001; // over 9000
  const seats = {};

  for (let i = 0; i < arr.length; ++i) {
    const current = arr[i];

    let seatId = 0;

    for (let j = 0 ; j < current.length; ++j) {
      if (current[j] === 'B') {
        seatId += ROW_SIZE * 2 ** (6 - j);
      } else if (current[j] === 'R') {
        seatId += 2 ** (9 - j);
      }
    }

    maxSeatId = Math.max(maxSeatId, seatId);
    minSeatId = Math.min(minSeatId, seatId);
    seats[seatId] = true;
  }

  let mySeatId = 0;
  for (let i = minSeatId; i < maxSeatId; ++i) {
    if (!seats[i]) {
      mySeatId = i;
      break
    }
  }

  console.log('Max seat ID:', maxSeatId);
  console.log('My seat ID:', mySeatId)
}

main().catch(console.error);
