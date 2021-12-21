import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  const re = /\s(\d+)$/;
  const player1 = +rows[0].match(re)[1];
  const player2 = +rows[1].match(re)[1];
  return [
    { score: 0, pos: player1 },
    { score: 0, pos: player2 },
  ];
};

let getNewPos = (pos, i) => {
  let newPos = pos + i + i + 1 + i + 2;
  return newPos % 10 === 0 ? 10 : newPos % 10;
};

let roll = (pos) => {
  let newPos = pos + 3;
  return newPos > 100 ? newPos % 100 : newPos;
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
