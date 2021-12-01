const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
  const arr = content
    .split(/\n/g)
    .filter((i) => i)
    .map((raw) => {
      return raw.replace(/\s/g, '').split('');
    });

  const operation = {
    '+': (a, b) => +a + +b,
    '*': (a, b) => +a * +b,
  };

  function solveExpr(expr, priorities) {
    const stack = [];

    const evaluateStack = (i) => {
      let prevOp = stack[stack.length - 2];
      const nextOp = expr[i + 1];
      while (
        (!nextOp ||
          ((prevOp === '+' || prevOp === '*') && priorities[prevOp] >= priorities[nextOp])) &&
        stack.length > 2
      ) {
        const right = stack.pop();
        const op = stack.pop();
        const left = stack.pop();
        prevOp = stack[stack.length - 2];
        stack.push(operation[op](left, right));
      }
    };

    for (let i = 0; i < expr.length; ++i) {
      const char = expr[i];

      if (char === '(') {
        let open = 1;
        let idx = i;
        for (let j = 1; j < expr.length - i && open > 0; ++j) {
          if (expr[i + j] === '(') {
            open += 1;
          }
          if (expr[i + j] === ')') {
            open -= 1;
            idx = i + j;
          }
        }
        const subexpr = expr.slice(i + 1, idx);
        stack.push(solveExpr(subexpr, priorities));
        i = idx;
        evaluateStack(i);
        continue;
      }

      stack.push(char);

      if (+char || char === '0') {
        evaluateStack(i);
      } else if (char === '*' || char === '+') {
        // DO nothing
      } else {
        throw new Error(`Unrecognized character ${char}`);
      }
    }

    return `${stack[0]}`;
  }

  let res1 = 0;
  let res2 = 0;
  arr.forEach((expr) => {
    res1 += +solveExpr(expr, { '+': 1, '*': 1 });
    res2 += +solveExpr(expr, { '+': 2, '*': 1 });
  });

  console.log('Part 1: %d', res1);
  console.log('Part 2: %d', res2);
}

main().catch(console.error);
