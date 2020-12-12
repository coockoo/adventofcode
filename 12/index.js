const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      const match = raw.match(/([NWESRLF])(\d+)/);
      return {
        comm: match[1],
        value: +match[2],
      };
    });

  //   N
  // W   E
  //   S

  let x = 0;
  let y = 0;
  let dir = 'E';

  const changeValues = (comm, value) => {
    if (comm === 'N') {
      y += value;
    }
    if (comm === 'S') {
      y -= value;
    }

    if (comm === 'E') {
      x += value;
    }
    if (comm === 'W') {
      x -= value;
    }
  };

  const sides = ['E', 'S', 'W', 'N'];

  for (let i = 0; i < arr.length; ++i) {
    const c = arr[i];

    changeValues(c.comm, c.value);

    if (c.comm === 'F') {
      changeValues(dir, c.value);
    }

    if (c.comm === 'R') {
      const val = c.value / 90;
      dir = sides[(sides.indexOf(dir) + val) % sides.length];
    }

    if (c.comm === 'L') {
      const val = c.value / 90;
      dir = sides[(sides.indexOf(dir) - val + sides.length) % sides.length];
    }
  }

  console.log('Ans 1:', Math.abs(x) + Math.abs(y));

  x = 0;
  y = 0;
  dir = 'E';
  let dx = 10;
  let dy = 1;

  const changeValues2 = (comm, value) => {
    if (comm === 'N') {
      dy += value;
    }
    if (comm === 'S') {
      dy -= value;
    }

    if (comm === 'E') {
      dx += value;
    }
    if (comm === 'W') {
      dx -= value;
    }
  };

  for (let i = 0; i < arr.length; ++i) {
    const c = arr[i];

    changeValues2(c.comm, c.value);

    if (c.comm === 'F') {
      x += dx * c.value;
      y += dy * c.value;
    }

    const val = c.value / 90;
    if ((c.comm === 'R' || c.comm === 'L') && val === 2) {
      dx = -dx;
      dy = -dy;
    }

    const rotate = (dir) => {
      if (dir === 'R') {
        const t = dy;
        dy = -dx;
        dx = t;
      }
      if (dir === 'L') {
        const t = dy;
        dy = dx;
        dx = -t;
      }
    };

    if (c.comm === 'R') {
      if (val === 1) {
        rotate('R');
      }
      if (val === 3) {
        rotate('L');
      }
    }
    if (c.comm === 'L') {
      if (val === 1) {
        rotate('L');
      }
      if (val === 3) {
        rotate('R');
      }
    }
  }

  console.log('Ans 2:', Math.abs(x) + Math.abs(y));
}

main().catch(console.error);
