import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

let energy = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

// h1, h2, h3, h4, h5, h6, h7
//       a1  b1  c1  d1
//       a2  b2  c2  d2

const edges = [
  { f: 'h1', t: 'h2', d: 1 },
  //
  { f: 'h2', t: 'h1', d: 1 },
  { f: 'h2', t: 'h3', d: 2 },
  { f: 'h2', t: 'a1', d: 2 },
  //
  { f: 'h3', t: 'h2', d: 2 },
  { f: 'h3', t: 'h4', d: 2 },
  { f: 'h3', t: 'a1', d: 2 },
  { f: 'h3', t: 'b1', d: 2 },
  //
  { f: 'h4', t: 'h3', d: 2 },
  { f: 'h4', t: 'h5', d: 2 },
  { f: 'h4', t: 'b1', d: 2 },
  { f: 'h4', t: 'c1', d: 2 },
  //
  { f: 'h5', t: 'h4', d: 2 },
  { f: 'h5', t: 'h6', d: 2 },
  { f: 'h5', t: 'c1', d: 2 },
  { f: 'h5', t: 'd1', d: 2 },
  { f: 'h6', t: 'h5', d: 2 },
  { f: 'h6', t: 'h7', d: 1 },
  { f: 'h6', t: 'd1', d: 2 },
  //
  { f: 'h7', t: 'h6', d: 1 },
  //

  { f: 'a1', t: 'h2', d: 2 },
  { f: 'a1', t: 'h3', d: 2 },
  { f: 'a1', t: 'a2', d: 1 },
  //
  { f: 'a2', t: 'a1', d: 1 },
  //
  { f: 'b1', t: 'h3', d: 2 },
  { f: 'b1', t: 'h4', d: 2 },
  { f: 'b1', t: 'b2', d: 1 },
  //
  { f: 'b2', t: 'b1', d: 1 },
  //
  { f: 'c1', t: 'h4', d: 2 },
  { f: 'c1', t: 'h5', d: 2 },
  { f: 'c1', t: 'c2', d: 1 },
  //
  { f: 'c2', t: 'c1', d: 1 },
  //
  { f: 'd1', t: 'h5', d: 2 },
  { f: 'd1', t: 'h6', d: 2 },
  { f: 'd1', t: 'd2', d: 1 },
  //
  { f: 'd2', t: 'd1', d: 1 },
];

const createState = (a1, b1, c1, d1, a2, b2, c2, d2) => ({
  energy: 0,
  score: Infinity,
  h1: {
    id: 'h1',
    value: null,
  },
  h2: {
    id: 'h2',
    value: null,
  },
  h3: {
    id: 'h3',
    value: null,
  },
  h4: {
    id: 'h4',
    value: null,
  },
  h5: {
    id: 'h5',
    value: null,
  },
  h6: {
    id: 'h6',
    value: null,
  },
  h7: {
    id: 'h7',
    value: null,
  },
  a1: {
    id: 'a1',
    value: a1,
    only: 'A',
  },
  a2: {
    id: 'a2',
    value: a2,
    only: 'A',
  },
  b1: {
    id: 'b1',
    value: b1,
    only: 'B',
  },
  b2: {
    id: 'b2',
    value: b2,
    only: 'B',
  },
  c1: {
    id: 'c1',
    value: c1,
    only: 'C',
  },
  c2: {
    id: 'c2',
    value: c2,
    only: 'C',
  },
  d1: {
    id: 'd1',
    value: d1,
    only: 'D',
  },
  d2: {
    id: 'd2',
    value: d2,
    only: 'D',
  },
});

const hall = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
const apt = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'];
const shallow = ['a1', 'b1', 'c1', 'd1'];
const deep = ['a2', 'b2', 'c2', 'd2'];

const canMove = (state, edge) => {
  const nf = state[edge.f];
  const nt = state[edge.t];

  if (!nf.value) {
    return false;
  }

  if (nt.value) {
    return false;
  }

  if (hall.includes(edge.f) && apt.includes(edge.t) && nt.only !== nf.value) {
    return false;
  }

  if (deep.includes(edge.f) && nf.value === nf.only) {
    return false;
  }

  const getApt = (pos) => pos.match(/^([a-z])/)[1];
  const isAptOnPlace = (a) =>
    [1, 2, 3, 4].every((i) => {
      const key = `${a}${i}`;
      return !state[key] || state[key].only === state[key].value;
    });

  if (apt.includes(edge.f) && isAptOnPlace(getApt(edge.f))) {
    return false;
  }

  const isOnPlace = (id) => state[id].only === state[id].value;
  const isFromShallow = shallow.includes(edge.f);
  const isFromDeep = deep.includes(edge.f);
  const isToDeep = deep.includes(edge.t);

  if (isFromDeep && isOnPlace(edge.f)) {
    return false;
  }

  if (isFromShallow && isToDeep && !isOnPlace(edge.f)) {
    return false;
  }

  if (nf.value === 'D' && ['h1', 'h2', 'h7'].includes(edge.t)) {
    return false;
  }

  return true;
};

const move = (state, node, edge) => {
  const { value } = node;
  let newState = {
    ...state,
    energy: state.energy + energy[value] * edge.d,
    [node.id]: {
      ...state[node.id],
      value: null,
    },
    [edge.t]: {
      ...state[edge.t],
      value,
    },
  };
  newState.score = getScore(newState);
  return newState;
};

const getScore = (state) => {
  let score = 0;
  Object.entries(state).forEach(([key, node]) => {
    if (node.only && node.only !== node.value) {
      score += 1;
    }
    if (!node.only && node.value) {
      score += 1;
    }

    if (node.value === 'D') {
      if (key === 'h5' || key === 'h6') {
        score += 1;
      }
      if (key === 'h4' || key === 'h7' || key == 'c1') {
        score += 2;
      }
      if (key === 'h3' || key === 'c2' || key === 'b1') {
        score += 3;
      }
      if (key === 'h2' || key === 'b2' || key === 'a1') {
        score += 4;
      }
      if (key === 'h1' || key === 'a2') {
        score += 5;
      }
    }

    if (node.value === 'C') {
      if (key === 'h4' || key === 'h5') {
        score += 1;
      }
      if (key === 'h3' || key === 'h6' || key === 'b1' || key === 'd1') {
        score += 2;
      }
      if (key === 'h2' || key === 'h7' || key === 'b2' || key === 'd2' || key === 'a1') {
        score += 3;
      }
      if (key === 'h1' || key === 'a2') {
        score += 4;
      }
    }

    if (node.value === 'B') {
      if (key === 'h3' || key === 'h4') {
        score += 1;
      }

      if (key === 'h2' || key === 'h5' || key === 'a1' || key === 'c1') {
        score += 2;
      }

      if (key === 'h1' || key === 'h6' || key === 'a2' || key === 'c2' || key === 'd1') {
        score += 3;
      }

      if (key === 'd2' || key === 'h7') {
        score += 4;
      }
    }

    if (node.value === 'A') {
      if (key === 'h2' || key === 'h3') {
        score += 1;
      }
      if (key === 'h4' || key === 'h1' || key == 'b1') {
        score += 2;
      }
      if (key === 'h5' || key === 'b2' || key === 'c1') {
        score += 3;
      }
      if (key === 'h6' || key === 'c2' || key === 'd1') {
        score += 4;
      }
      if (key === 'h7' || key === 'd2') {
        score += 5;
      }
    }
  });
  return score;
};

const getKey = (state) => {
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2']
    .map((k) => state[k].value || '.')
    .join(';');
};

export const part1 = (rows) => {
  let values = rows
    .join('')
    .split('')
    .filter((i) => ['A', 'B', 'C', 'D'].includes(i));
  const initialState = createState(...values);
  let states = [initialState];

  let res = {};
  let minEnergy = Infinity;

  while (states.length) {
    const state = states.pop();
    const key = getKey(state);
    console.log(states.length, state.score, state.energy);
    if (res[key]) {
      continue;
    }
    res[key] = true;
    if (state.energy > minEnergy) {
      break;
    }
    for (let i = 0; i < edges.length; ++i) {
      const e = edges[i];
      const node = state[e.f];
      if (!canMove(state, e)) {
        continue;
      }
      let newState = move(state, node, e);
      if (newState.score === 0) {
        if (newState.energy < minEnergy) {
          minEnergy = newState.energy;
        }
        continue;
      }
      states.push(newState);
    }
    states = states.sort((a, b) => b.energy - a.energy);
  }
  return minEnergy;
};

export const part2 = (rows) => {
  // const arr = rows.map(Number)
  let res = 0;
  // add implementation
  return res;
};
