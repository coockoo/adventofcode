const getKey = (pos) => `${pos[0]}:${pos[1]}`;

const DS = [-1, 0, 1];

const getMoves = (map, pos) => {
  let current = map[getKey(pos)];
  current = current === 'S' ? 'a' : current;
  current = current === 'E' ? 'z' : current;
  const pv = current.charCodeAt(0);

  const res = [];
  DS.forEach((dy) => {
    DS.forEach((dx) => {
      if (!dy && !dx) {
        return;
      }
      if (Math.abs(dy) === 1 && Math.abs(dx) === 1) {
        return;
      }
      const npos = [pos[0] + dy, pos[1] + dx];
      let nv = map[getKey(npos)];
      nv = nv === 'S' ? 'a' : nv;
      nv = nv === 'E' ? 'z' : nv;
      const d = nv && nv.charCodeAt(0) - pv;
      if (d <= 1) {
        res.push(npos);
      }
    });
  });
  return res;
};

export const part1 = (rows) => solve(rows, (cell) => cell === 'S');
export const part2 = (rows) => solve(rows, (cell) => cell === 'S' || cell === 'a');

const solve = (rows, isInitial) => {
  const map = {};
  let routes = [];
  let end = [0, 0];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const cells = row.split('');
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      const cpos = [i, j];
      map[getKey(cpos)] = cell;

      if (isInitial(cell)) {
        routes.push(cpos);
      }
      if (cell === 'E') {
        end = cpos;
      }
    }
  }

  let ds = {};

  for (let route of routes) {
    ds[getKey(route)] = 0;
  }

  let current = null;
  do {
    current = routes.shift();
    if (!current) {
      break;
    }
    const ck = getKey(current);
    const moves = getMoves(map, current);
    for (let move of moves) {
      const mk = getKey(move);
      if (!ds[mk]) {
        ds[mk] = ds[ck] + 1;
        routes.push(move);
        continue;
      }

      if (ds[mk] > ds[ck] + 1) {
        ds[mk] = ds[ck] + 1;
        routes.push(move);
      }
    }
    routes = routes.sort((a, b) => ds[getKey(a)] - ds[getKey(b)]);
  } while (getKey(current) !== getKey(end));

  return ds[getKey(end)];
};
