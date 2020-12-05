const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    return raw.split('');
  });

  let maxSeatId = 0;

  const allSeats = Array(128 * 8).fill().map((_, i) => i);

  for (let i = 0; i < arr.length; ++i) {
    const current = arr[i];

    let rows = Array(128).fill().map((_, i) => i);
    let columns = Array(8).fill().map((_, i) => i);

    for (let j =0 ; j < current.length; ++j) {
      if (current[j] === 'B') {
        rows = rows.slice(rows.length / 2);
      } else if (current[j] === 'F') {
        rows = rows.slice(0, rows.length /2);
      } else if (current[j] === 'R') {
        columns = columns.slice(columns.length /2)
      } else if (current[j] === 'L') {
        columns = columns.slice(0, columns.length /2)
      }
    }

    const seatId = rows[0] * 8 + columns[0];

    maxSeatId = Math.max(maxSeatId, seatId);

    if (allSeats.indexOf(seatId) >= 0) {
      allSeats[allSeats.indexOf(seatId)] = 0;
    }
  }

  console.log('Max seat ID:', maxSeatId);
  console.log('My seat ID:', allSeats.filter(i => i && allSeats[i] - allSeats[i - 1] > 1)[0])
}

main().catch(console.error);
