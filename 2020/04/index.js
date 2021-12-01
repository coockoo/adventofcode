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

    const rules = [
      requiredFields,
      isValidByr,
      isValidIyr,
      isValidEyr,
      isValidHgt,
      isValidHcl,
      isValidEcl,
      isValidPid,
    ];
    const isPassportValid = rules.every(rule => {
      const isValid = rule(passport);
      if (!isValid) {
        console.log(`PASSPORT INVALID ${rule.name}`, passport)
      }
      return isValid;
    })
    if (isPassportValid) {
      res += 1;
    }
  }
}

function requiredFields(passport) {
  const keys = Object.keys(passport);
  const len = keys.length;
  return len === 8 || (len === 7 && !passport.cid);
}

function isValidByr(passport) {
  return passport.byr && passport.byr.match(/^\d{4}$/) && +passport.byr >= 1920 && +passport.byr <= 2002;
}

function isValidIyr(passport) {
  return passport.iyr && passport.iyr.match(/^\d{4}$/) && +passport.iyr >= 2010 && +passport.iyr <= 2020;
}

function isValidEyr(passport) {
  return passport.eyr && passport.eyr.match(/^\d{4}$/) && +passport.eyr >= 2020 && +passport.eyr <= 2030;
}

function isValidHgt (passport) {
  if (!passport.hgt) {
    return false;
  }
  const match = passport.hgt.match(/^(\d{2,3})(cm|in)$/);
  if (!match) {
    return false;
  }

  const value = +match[1];
  const metric = match[2];

  return (
    (metric === 'in' && 59 <= value && value <= 76)
    || (metric === 'cm' && 150 <= value && value <= 193)
  )
}

function isValidHcl(passport) {
  return passport.hcl && passport.hcl.match(/^#[0-9a-f]{6}$/);
}

function isValidEcl(passport) {
  const possibleEcls = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  return passport.ecl && possibleEcls.includes(passport.ecl);
}

function isValidPid(passport) {
  return !!passport.pid && !!passport.pid.match(/^\d{9}$/);
}


main().catch(console.error);
