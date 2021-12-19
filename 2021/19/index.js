import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const getKey = (point) => {
  const [x, y, z] = point;
  return `${x},${y},${z}`;
};

const rotateX = ([x, y, z], times) => {
  if (times === 0) {
    return [x, y, z];
  }
  return rotateX([x, -z, y], times - 1);
};
const rotateY = ([x, y, z], times) => {
  if (times === 0) {
    return [x, y, z];
  }
  return rotateY([-z, y, x], times - 1);
};
const rotateZ = ([x, y, z], times) => {
  if (times === 0) {
    return [x, y, z];
  }
  return rotateZ([y, -x, z], times - 1);
};

const getRotations = (point) => {
  let points = [];
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      for (let k = 0; k < 4; ++k) {
        points.push(rotateX(rotateY(rotateZ(point, i), j), k));
      }
    }
  }
  return Array.from(new Set(points.map(getKey))).map((i) => i.split(',').map((i) => +i));
};

const getScannerRotations = (scanner) => {
  const res = [];
  for (let i = 0; i < scanner.length; ++i) {
    const point = scanner[i];
    const rotations = getRotations(point);
    for (let j = 0; j < rotations.length; ++j) {
      if (!res[j]) {
        res[j] = [];
      }
      res[j].push(rotations[j]);
    }
  }
  return res;
};

const parseInput = (rows) => {
  let scanners = [];
  let scanner = [];
  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    if (row.startsWith('---')) {
      if (scanner.length) {
        scanners.push(scanner);
      }
      scanner = [];
      continue;
    }
    scanner.push(row.split(',').map((i) => +i));
  }
  scanners.push(scanner);
  return scanners;
};

const distance = (fromPoint, toPoint) => {
  let res = 0;
  for (let i = 0; i < 3; ++i) {
    res += Math.abs(fromPoint[i] - toPoint[i]);
  }
  return res;
};

const toAbsolute = (point, refPoint) => {
  const [x, y, z] = point;
  const [rx, ry, rz] = refPoint;
  return [x + rx, y + ry, z + rz];
};

const getRef = (absScanner, refScanner) => {
  const acc = {};
  for (let i = 0; i < absScanner.length; ++i) {
    const [x, y, z] = absScanner[i];
    for (let j = 0; j < refScanner.length; ++j) {
      const [rx, ry, rz] = refScanner[j];
      const r = [x - rx, y - ry, z - rz];
      const key = getKey(r);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(getKey(toAbsolute(refScanner[j], r)));
    }
  }
  const ref = Object.keys(acc).filter((i) => acc[i].length >= 12)[0];
  return ref && ref.split(',').map((i) => +i);
};

export const part1 = (rows) => {
  const scanners = parseInput(rows);
  let refs = { 0: [0, 0, 0] };
  let abs = [scanners[0]];

  while (Object.keys(refs).length !== scanners.length) {
    console.log(Object.keys(refs).length, '/', scanners.length);
    for (let i = 1; i < scanners.length; ++i) {
      if (refs[i]) {
        continue;
      }
      const scanner = scanners[i];

      const scannerRotations = getScannerRotations(scanner);

      let ref;
      let scannerRotation;
      for (let j = 0; j < scannerRotations.length; ++j) {
        scannerRotation = scannerRotations[j];
        for (let k = 0; k < abs.length; ++k) {
          ref = getRef(abs[k], scannerRotation, k);
          if (ref) {
            break;
          }
        }
        if (ref) {
          break;
        }
      }
      if (ref) {
        refs[i] = ref;
        abs.push(scannerRotation.map((p) => toAbsolute(p, ref)));
      }
    }
  }

  const s = new Set(abs.flatMap((i) => i).map(getKey));
  return s.size;
};

export const part2 = (rows) => {
  const scanners = parseInput(rows);
  let refs = { 0: [0, 0, 0] };
  let abs = [scanners[0]];

  while (Object.keys(refs).length !== scanners.length) {
    console.log(Object.keys(refs).length, '/', scanners.length);
    for (let i = 1; i < scanners.length; ++i) {
      if (refs[i]) {
        continue;
      }
      const scanner = scanners[i];

      const scannerRotations = getScannerRotations(scanner);

      let ref;
      let scannerRotation;
      for (let j = 0; j < scannerRotations.length; ++j) {
        scannerRotation = scannerRotations[j];
        for (let k = 0; k < abs.length; ++k) {
          ref = getRef(abs[k], scannerRotation, k);
          if (ref) {
            break;
          }
        }
        if (ref) {
          break;
        }
      }
      if (ref) {
        refs[i] = ref;
        abs.push(scannerRotation.map((p) => toAbsolute(p, ref)));
      }
    }
  }

  let max = -1;
  const values = Object.values(refs);
  for (let i = 0; i < values.length; ++i) {
    for (let j = 0; j < values.length; ++j) {
      max = Math.max(max, distance(values[i], values[j]));
    }
  }
  return max;
};
