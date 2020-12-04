const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')

  const passports = []
  let passportRaw = '';

  content.split(/\n/g).forEach(raw => {
    if (!raw.length) {
      const passport = {
      };
      passportRaw.split(/\s/g).forEach(tupleStr => {
        const [key, value] = tupleStr.split(/:/g)
        if (!key) {
          return;
        }
        passport[key] = value;
      });
      passports.push(passport);
      passportRaw = '';
      return
    }
    passportRaw += ` ${raw}`;
  });

  let res = 0;
  for (let i = 0; i < passports.length; ++i) {
    const passport = passports[i]
    const keys = Object.keys(passport);
    const len = keys.length;

    const isValidHgt = () => {
      if (!passport.hgt) {
        return false;
      }
      const match = passport.hgt.match(/(\d{2,3})(cm|in)/);
      if (!match) {
        return false;
      }
      if (match[2] === 'in' && +match[1] >= 59 && +match[1] <= 76) {
        return true
      }
      if (match[2] === 'cm' && +match[1] >= 150 && +match[1] <= 193) {
        return true
      }
      return false
    }

    if (
      (len === 8 || (len === 7 && !passport.cid))
      && (passport.byr && passport.byr.match(/^\d{4}$/) && +passport.byr >= 1920 && +passport.byr <= 2002)
      && (passport.iyr && passport.iyr.match(/^\d{4}$/) && +passport.iyr >= 2010 && +passport.iyr <= 2020)
      && (passport.eyr && passport.eyr.match(/^\d{4}$/) && +passport.eyr >= 2020 && +passport.eyr <= 2030)
      && isValidHgt()
      && (passport.hcl && passport.hcl.match(/^#[0-9a-f]{6}$/))
      && (passport.ecl && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl))
      && (passport.pid && passport.pid.match(/^\d{9}$/))
    ) {
      res += 1;
      console.log('PASSPORT VALID', passport);
    } else {
      console.log('PASSPORT INVALID', passport);
    }
  }
  console.log(res);
}

main().catch(console.error);
