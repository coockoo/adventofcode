import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  const re = /\s(\d+)$/;
  const player1 = +rows[0].match(re)[1];
  const player2 = +rows[1].match(re)[1];
  return [
    { id: 1, score: 0, pos: player1, times: 1 },
    { id: 2, score: 0, pos: player2, times: 3 },
  ];
};

let getNewPos = (pos, i) => {
  let newPos = pos + i + i + 1 + i + 2;
  return newPos % 10 === 0 ? 10 : newPos % 10;
};

let gnp = (pos, i) => {
  let newPos = pos + i;
  return newPos % 10 === 0 ? 10 : newPos % 10;
};

let roll = (pos) => {
  let newPos = pos + 3;
  return newPos > 100 ? newPos % 100 : newPos;
};

const getCombinations = (n) => {
  let res = {};
  for (let i = 1; i <= n; ++i) {
    for (let j = 1; j <= n; ++j) {
      for (let k = 1; k <= n; ++k) {
        let x = i + j + k;
        res[x] = (res[x] || 0) + 1;
      }
    }
  }
  return Object.entries(res).map(([key, value]) => [+key, value]);
};

export const part1 = (rows) => {
  let [p1, p2] = parseInput(rows);
  let i = 1;
  let j = 0;
  const maxScore = 1000;
  while (p1.score < maxScore && p2.score < maxScore) {
    if (j % 2 === 0) {
      p1.pos = getNewPos(p1.pos, i);
      p1.score += p1.pos;
    } else {
      p2.pos = getNewPos(p2.pos, i);
      p2.score += p2.pos;
    }
    i = roll(i);
    j += 1;
  }
  return Math.min(p1.score, p2.score) * j * 3;
};

export const part2 = (rows) => {
  const re = /\s(\d+)$/;
  const player1 = +rows[0].match(re)[1];
  const player2 = +rows[1].match(re)[1];

  let states = [
    {
      id: 1,
      times: 1,
      1: { id: 1, score: 0, pos: player1 },
      2: { id: 2, score: 0, pos: player2 },
    },
  ];

  let res = { 1: 0, 2: 0 };
  let maxScore = 21;

  const combinations = getCombinations(3);

  while (states.length) {
    let s = states.pop(); // TODO: replace with pop
    let p = s[s.id];

    for (let i = 0; i < combinations.length; ++i) {
      const [shift, times] = combinations[i];
      const pos = gnp(p.pos, shift);
      const score = p.score + pos;
      if (score >= maxScore) {
        res[p.id] += s.times * times;
        continue;
      }
      let newState = {
        id: 3 - p.id,
        times: s.times * times,
        [p.id]: { id: p.id, score, pos },
        [3 - p.id]: s[3 - p.id],
      };

      states.push(newState);
    }
  }
  return Math.max(...Object.values(res));
};
