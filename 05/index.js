const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    return raw.split('');
  });

  let res = 0;

  let x = Array(128 * 8).fill().map((_, i) => i);

  for (let i = 0; i < arr.length; ++i) {
    const current = arr[i];

    const localres = 0;
    const column = 0;

    let t = Array(128).fill().map((_, i) => i);
    let z = Array(8).fill().map((_, i) => i);
    for (let j =0 ; j < current.length; ++j) {
      if (current[j] === 'B') {
        t = t.slice(t.length / 2);
      } else if (current[j] === 'F') {
        t = t.slice(0, t.length /2);
      } else if (current[j] === 'R') {
        z = z.slice(z.length /2)
      } else if (current[j] === 'L') {
        z = z.slice(0, z.length /2)
      }
    }

    if (t[0] * 8 + z[0] > res) {
      res = t[0] * 8 + z[0]
    }
    if (x.indexOf(t[0] * 8 + z[0]) >= 0) {
      x[x.indexOf(t[0] * 8 + z[0])] = 0;
    }
  }



  console.log(res);
  console.log(x.filter(i => i && x[i] - x[i - 1] > 1)[0])
}

main().catch(console.error);
