const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  const arr = content.split(/\n/g).filter(i => i).map(i => {
    const [_, min, max, letter, password] = i.match(/(\d+)\-(\d+) (\S): (.+)/)
    return { min, max, letter, password };
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

  console.log('There are', validPasswords, 'valid passwords.');
}

main().catch(console.error)
