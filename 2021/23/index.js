import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const HALLS_COUNT = 7;
const ENERGY = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};
const DISTANCES = {
  0: { A: 3, B: 5, C: 7, D: 9, 0: 0, 1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 10 },
  1: { A: 2, B: 4, C: 6, D: 8, 0: 1, 1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 9 },
  2: { A: 2, B: 2, C: 4, D: 6, 0: 3, 1: 2, 2: 0, 3: 2, 4: 4, 5: 6, 6: 7 },
  3: { A: 4, B: 2, C: 2, D: 4, 0: 5, 1: 4, 2: 2, 3: 0, 4: 2, 5: 4, 6: 5 },
  4: { A: 6, B: 4, C: 2, D: 2, 0: 7, 1: 6, 2: 4, 3: 2, 4: 0, 5: 2, 6: 3 },
  5: { A: 8, B: 6, C: 4, D: 2, 0: 9, 1: 8, 2: 6, 3: 4, 4: 2, 5: 0, 6: 1 },
  6: { A: 9, B: 7, C: 5, D: 3, 0: 10, 1: 9, 2: 7, 3: 5, 4: 3, 5: 1, 6: 0 },
  A: { 0: 3, 1: 2, 2: 2, 3: 4, 4: 6, 5: 8, 6: 9 },
  B: { 0: 5, 1: 4, 2: 2, 3: 2, 4: 4, 5: 6, 6: 7 },
  C: { 0: 7, 1: 6, 2: 4, 3: 2, 4: 2, 5: 4, 6: 5 },
  D: { 0: 9, 1: 8, 2: 6, 3: 4, 4: 2, 5: 2, 6: 3 },
};

const parseInput = (rows) =>
  rows
    .join('')
    .split('')
    .filter((i) => LETTERS.includes(i));

const createState = (values) => {
  let state = {
    energy: 0,
    H: new Array(HALLS_COUNT).fill(null),
  };
  let count = values.length / LETTERS.length;
  for (let i = 1; i <= count; ++i) {
    for (const letter of LETTERS) {
      if (!state[letter]) {
        state[letter] = [];
      }
      state[letter].push(values.shift());
    }
  }
  return state;
};

const toString = (state, depth) => {
  let res = ['#############'];

  let hall = [];
  hall.push('#');
  for (let i = 0; i < state.H.length; ++i) {
    const t = state.H[i] || '.';
    hall.push(t);
    if (i > 0 && i < HALLS_COUNT - 2) {
      hall.push('.');
    }
  }
  hall.push('#');
  res.push(hall.join(''));

  for (let i = 0; i < depth; ++i) {
    let room = [];
    if (i === 0) {
      room.push('###');
    } else {
      room.push('  #');
    }
    for (const letter of LETTERS) {
      const t = state[letter].join('').padStart(depth, '.').split('');
      room.push(t[i]);
      room.push('#');
    }
    if (i === 0) {
      room.push('##');
    } else {
      room.push('  ');
    }
    res.push(room.join(''));
  }
  res.push('  #########  ');
  return res.join('\n');
};

const canGetTo = (state, fromRoom, fromPos, toRoom, toPos) => {
  let from = fromPos;
  if (fromRoom === 'A') {
    from = toPos < 1 ? 1 : 2;
  }
  if (fromRoom === 'B') {
    from = toPos < 3 ? 2 : 3;
  }
  if (fromRoom === 'C') {
    from = toPos < 4 ? 3 : 4;
  }
  if (fromRoom === 'D') {
    from = toPos < 5 ? 4 : 5;
  }

  let to = toPos;
  if (toRoom === 'A') {
    to = fromPos < 1 ? 1 : 2;
  }
  if (toRoom === 'B') {
    to = fromPos < 3 ? 2 : 3;
  }
  if (toRoom === 'C') {
    to = fromPos < 4 ? 3 : 4;
  }
  if (toRoom === 'D') {
    to = fromPos < 5 ? 4 : 5;
  }

  let count = fromRoom === 'H' ? -1 : 0;
  for (let i = Math.min(from, to); i <= Math.max(from, to); ++i) {
    if (state.H[i]) {
      count += 1;
    }
  }
  const res = count === 0;

  return res;
};

const move = (state, room, pos, depth) => {
  let value = room === 'H' ? state[room][pos] : state[room][0];

  if (!value) {
    return [];
  }

  if (room === 'H') {
    if (!canGetTo(state, room, pos, value, undefined)) {
      return [];
    }

    const canEnter = state[value].every((item) => item === value);
    if (!canEnter) {
      return [];
    }

    const distance = DISTANCES[pos][value] + depth - 1 - state[value].length;

    return [
      {
        ...state,
        energy: state.energy + ENERGY[value] * distance,
        H: state.H.map((item, idx) => (idx === pos ? null : item)),
        [value]: [...state[value], value],
      },
    ];
  }

  const isOnPlace = state[room].every((item) => item === room);
  if (isOnPlace) {
    return [];
  }

  let states = [];
  for (let i = 0; i < HALLS_COUNT; ++i) {
    if (!canGetTo(state, room, undefined, 'H', i)) {
      continue;
    }

    let roomDistance = depth - state[room].length;
    let hallDistance = DISTANCES[room][i];

    states.push({
      ...state,
      energy: state.energy + (roomDistance + hallDistance) * ENERGY[value],
      H: state.H.map((item, index) => (index === i ? value : item)),
      [room]: state[room].slice(1),
    });
  }
  return states;
};

const isWin = (state) => {
  return (
    state.H.every((i) => !i) &&
    state.A.every((i) => i === 'A') &&
    state.B.every((i) => i === 'B') &&
    state.C.every((i) => i === 'C') &&
    state.D.every((i) => i === 'D')
  );
};

const getKey = (state, depth) => {
  return [
    ...state.H.map((i) => i || '.'),
    ...state.A.join('').padStart(depth, '.'),
    ...state.B.join('').padStart(depth, '.'),
    ...state.C.join('').padStart(depth, '.'),
    ...state.D.join('').padStart(depth, '.'),
  ].join('');
};

const solve = (rows, extraStr = '') => {
  const rawValues = parseInput(rows);
  let extra = extraStr.split('');
  const values = [...rawValues.slice(0, LETTERS.length), ...extra, ...rawValues.slice(LETTERS.length)];
  const depth = values.length / LETTERS.length;
  const initialState = createState(values);
  let states = [initialState];
  let minEnergy = Infinity;
  let seen = {};

  while (states.length) {
    const state = states.pop();
    console.log(states.length, state.energy);
    const key = getKey(state, depth);
    if (seen[key]) {
      continue;
    }
    if (state.energy > minEnergy) {
      break;
    }

    if (isWin(state)) {
      minEnergy = Math.min(minEnergy, state.energy);
    }
    seen[key] = true;
    const newStates = [];
    for (const letter of LETTERS) {
      newStates.push(...move(state, letter, undefined, depth));
    }
    for (let i = 0; i < HALLS_COUNT; ++i) {
      newStates.push(...move(state, 'H', i, depth));
    }
    states.push(...newStates);
    states = states.sort((a, b) => b.energy - a.energy);
  }

  return minEnergy;
};

export const part1 = (rows) => solve(rows);
export const part2 = (rows) => solve(rows, 'DCBADBAC');
