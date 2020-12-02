const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(raw => {
    const [_, min, max, letter, password] = raw.match(/(\d+)\-(\d+) (\S): (.+)/)
    return { min, max, letter, password, raw };
  });

  let validPasswords = 0;
  for(let i = 0; i < arr.length; ++i) {
    const { min, max, letter, password } = arr[i];
    let current = 0;
    for(let j = 0; j < password.length; ++j) {
      if (password[j] === letter) {
        current += 1;
      }
    }
    if (current >= min && current <= max) {
      validPasswords += 1;
    }
  }

  console.log('There are', validPasswords, 'valid passwords for first policy.');

  let validPasswords2 = 0;
  for(let i = 0; i < arr.length; ++i) {
    const { min, max, letter, password } = arr[i];
    if (password[min - 1] === letter ^ password[max -1] === letter) {
      validPasswords2 += 1;
    }
  }

  console.log('There are', validPasswords2, 'valid passwords for second policy.');
}

main().catch(console.error)
