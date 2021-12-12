import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {
  const connections = {};
  for (let i = 0; i < rows.length; ++i) {
    if (!rows[i]) {
      continue;
    }
    const [from, to] = rows[i].split('-');
    if (!connections[from]) {
      connections[from] = [];
    }

    if (from !== 'end' && to !== 'start') {
      connections[from].push(to);
    }

    if (!connections[to]) {
      connections[to] = [];
    }

    if (to !== 'end' && from !== 'start') {
      connections[to].push(from);
    }
  }
  return connections;
};

const pathId = (arr) => arr.join(',');
const getLast = (id) => {
  const arr = id.split(',');
  return arr[arr.length - 1];
};

export const part1 = (rows) => {
  const connections = parseInput(rows);
  console.log(connections);
  let ids = ['start'];

  for (let c = 0; c < 20; ++c) {
    let newIds = [...ids];
    for (let i = 0; i < ids.length; ++i) {
      const id = ids[i];
      const from = getLast(id);
      for (let j = 0; j < connections[from].length; ++j) {
        const to = connections[from][j];
        if (to.toLowerCase() === to && id.includes(to)) {
          continue;
        }
        const newId = pathId([id, to]);
        if (ids.includes(newId)) {
          continue;
        }
        newIds.push(newId);
      }
    }
    ids = newIds;
  }
  const res = ids.sort().filter((i) => i.endsWith('end'));
  return res.length;
};

export const part2 = (rows) => {
  const connections = parseInput(rows);
  console.log(connections);
  let ids = { start: true };

  for (let c = 0; c < 17; ++c) {
    console.log('c', c);
    const idsArr = Object.keys(ids);
    for (let i = 0; i < idsArr.length; ++i) {
      const id = idsArr[i];
      const from = getLast(id);
      for (let j = 0; j < connections[from].length; ++j) {
        const to = connections[from][j];
        const s = id.split(',').sort();
        let hasSmall = false;
        let prev = s[0];
        for (let k = 1; k < s.length; ++k) {
          if (prev === s[k] && prev.toLowerCase() === prev) {
            hasSmall = true;
            break;
          }
          prev = s[k];
        }
        const count = s.filter((t) => t === to).length;
        if (to.toLowerCase() === to && count > (hasSmall ? 0 : 1)) {
          continue;
        }
        const newId = pathId([id, to]);
        if (ids[newId]) {
          continue;
        }
        ids[newId] = true;
      }
    }
  }

  const res = Object.keys(ids)
    .sort()
    .filter((i) => i.endsWith('end'));
  return res.length;
};
