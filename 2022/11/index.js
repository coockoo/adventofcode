const doEval = (monkey, k) => {
  const item = monkey.items[k];
  return doOp(monkey.l === 'old' ? item : +monkey.l, monkey.op, monkey.r === 'old' ? item : +monkey.r);
};

const doOp = (l, op, r) => {
  if (op === '*') {
    return l * r;
  }
  if (op === '+') {
    return l + r;
  }
  throw new Error(`op op ${op}`);
};

const solve = (rows, getWorryFn, rounds) => {
  const monkeys = parse(rows);
  const worryFn = getWorryFn(monkeys);

  for (let i = 0; i < rounds; ++i) {
    for (let j = 0; j < monkeys.length; ++j) {
      const monkey = monkeys[j];
      for (let k = 0; k < monkey.items.length; ++k) {
        monkey.inspects += 1;
        monkey.items[k] = doEval(monkey, k);
        monkey.items[k] = worryFn(monkey.items[k]);
        if (monkey.items[k] % monkey.div === 0) {
          monkeys.find((m) => m.id === monkey.yes).items.push(monkey.items[k]);
        } else {
          monkeys.find((m) => m.id === monkey.no).items.push(monkey.items[k]);
        }
        monkey.items[k] = undefined;
      }
      monkeys[j].items = monkey.items.filter((i) => i >= 0);
    }
  }

  const [r1, r2] = monkeys.map((m) => m.inspects).sort((a, b) => b - a);
  return r1 * r2;
};

const worryDiv = () => (item) => Math.floor(item / 3);
const worryGCD = (monkeys) => {
  const t = Array.from(new Set(monkeys.map((m) => m.div)));
  let gcd = 1;
  for (let i of t) {
    gcd *= i;
  }
  return (item) => item % gcd;
};

const parse = (rows) => {
  let monkeys = [];
  let monkey = undefined;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row && monkey) {
      monkeys.push(monkey);
    }
    const mMatch = row.match(/^Monkey (.+):/);
    if (mMatch) {
      monkey = {
        id: mMatch[1],
      };
    }
    const sMatch = row.match(/Starting items: (.+)$/);
    if (sMatch) {
      const items = sMatch[1].split(', ').map((i) => +i);
      monkey.items = items;
    }
    const oMatch = row.match(/Operation: new = (.+)/);
    if (oMatch) {
      const [l, op, r] = oMatch[1].split(' ');
      monkey.l = l;
      monkey.r = r;
      monkey.op = op;
    }

    const tMatch = row.match(/Test: divisible by (.+)/);
    if (tMatch) {
      monkey.div = +tMatch[1];
    }

    const yMatch = row.match(/If true: throw to monkey (.+)/);
    if (yMatch) {
      monkey.yes = yMatch[1];
    }

    const nMatch = row.match(/If false: throw to monkey (.+)/);
    if (nMatch) {
      monkey.no = nMatch[1];
    }
    monkey.inspects = 0;
  }
  return monkeys;
};

export const part1 = (rows) => solve(rows, worryDiv, 20);
export const part2 = (rows) => solve(rows, worryGCD, 10000);
