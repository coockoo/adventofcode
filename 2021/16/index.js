import { Matrix, Matrix2, Reducer } from '../../tools/index.js';

const parseInput = (rows) => {};

const TO_BIN = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const toDecimal = (bin) => {
  let res = 0;
  for (let i = 0; i < bin.length; ++i) {
    res += +bin[bin.length - 1 - i] * Math.pow(2, i);
  }
  return res;
};

export const part1 = (rows) => {
  let str = rows[0];

  let packet = {};
  let packets = [];

  let mode = 'version';
  let modeStep = 0;
  let modeRaw = [];

  let versionSum = 0;

  for (let i = 0; i < str.length; ++i) {
    let c = str[i];
    const bin = TO_BIN[c];
    for (let j = 0; j < bin.length; ++j) {
      let bit = bin[j];
      if (modeStep === 0) {
        modeRaw = [];
      }
      modeRaw.push(bit);
      modeStep += 1;
      packet.len = (packet.len || 0) + 1;

      if (!packet.raw) {
        packet.raw = [];
      }
      packet.raw.push(bit);

      if (mode === 'version') {
        if (modeStep === 3) {
          packet.version = toDecimal(modeRaw);
          versionSum += packet.version;
          mode = 'typeId';
          modeStep = 0;
        }

        if (mode !== 'exit') {
          continue;
        }
      }

      if (mode === 'typeId') {
        if (modeStep === 3) {
          packet.typeId = toDecimal(modeRaw);
          if (packet.typeId === 4) {
            mode = 'literal';
          } else {
            mode = 'lengthId';
          }
          modeStep = 0;
        }
        continue;
      }

      if (mode === 'lengthId') {
        packet.lengthId = modeRaw[0] === '0' ? 'subLen' : 'subNum';
        mode = 'length';
        modeStep = 0;
        continue;
      }

      if (mode === 'length') {
        if (packet.lengthId === 'subLen' && modeStep === 15) {
          packet.subLen = toDecimal(modeRaw);
          packet = { parent: packet };
          modeStep = 0;
          mode = 'version';
        }
        if (packet.lengthId === 'subNum' && modeStep === 11) {
          packet.subNum = toDecimal(modeRaw);
          packet = { parent: packet };
          modeStep = 0;
          mode = 'version';
        }
        continue;
      }

      if (mode === 'literal') {
        if (modeStep === 5) {
          if (!packet.bits) {
            packet.bits = [];
          }
          packet.bits.push(...modeRaw.slice(1));

          if (modeRaw[0] === '0') {
            packet.value = toDecimal(packet.bits);
            mode = 'exit';
          }
          modeStep = 0;
        }

        if (mode !== 'exit') {
          continue;
        }
      }

      if (mode === 'exit') {
        let { parent } = packet;

        if (parent) {
          if (!parent.sub) {
            parent.sub = [];
          }
          parent.sub.push(packet);

          delete packet.parent;
          if (parent.lengthId === 'subLen') {
            parent.subLen -= packet.len;
          }
          if (parent.lengthId === 'subNum') {
            parent.subNum -= 1;
          }
          parent.len += packet.len;

          if (parent.lengthId === 'subLen' && parent.subLen > 0) {
            packet = { parent };
          } else if (parent.lengthId === 'subNum' && parent.subNum > 0) {
            packet = { parent };
          } else {
            packets.push(parent);
            packet = {};
          }
        } else {
          packets.push(packet);
          packet = {};
        }
        mode = 'version';
        modeStep = 0;
        continue;
      }
    }
  }
  return versionSum;
};

const addToParent = (packet) => {
  const { parent } = packet;
  if (!parent) {
    return packet;
  }

  if (parent.lengthId === 'subLen') {
    parent.subLen -= packet.len;
  }

  if (parent.lengthId === 'subNum') {
    parent.subNum -= 1;
  }
  parent.len += packet.len;

  parent.sub.push(packet);
  delete packet.parent;

  if (parent.lengthId === 'subLen' && parent.subLen === 0) {
    return addToParent(parent);
  }
  if (parent.lengthId === 'subNum' && parent.subNum === 0) {
    return addToParent(parent);
  }

  return parent;
};

const handlers = {
  version: (raw, packet) => {
    if (raw.length < 3) {
      return;
    }
    packet.version = toDecimal(raw);
    return 'typeId';
  },
  typeId: (raw, packet) => {
    if (raw.length < 3) {
      return;
    }
    packet.typeId = toDecimal(raw);
    const { typeId } = packet;
    return typeId === 4 ? 'literal' : 'lengthId';
  },
  literal: (raw, packet) => {
    if (raw.length < 5) {
      return;
    }
    if (!packet.bits) {
      packet.bits = [];
    }
    const [flag, ...rest] = raw;
    packet.bits.push(...rest);

    if (flag === '0') {
      packet.value = toDecimal(packet.bits);
      delete packet.bits;

      let parent = addToParent(packet);

      if (parent.lengthId === 'subLen' && parent.subLen > 0) {
        return ['version', { parent }];
      }
      if (parent.lengthId === 'subNum' && parent.subNum > 0) {
        return ['version', { parent }];
      }

      return ['exit', parent];
    }
    return 'literal';
  },
  lengthId: (raw, packet) => {
    const [flag] = raw;
    packet.lengthId = flag === '0' ? 'subLen' : 'subNum';
    return 'length';
  },
  length: (raw, packet) => {
    if (packet.lengthId === 'subLen') {
      if (raw.length < 15) {
        return;
      }
      packet.subLen = toDecimal(raw);
      packet.sub = [];
      packet = { parent: packet };
    }
    if (packet.lengthId === 'subNum') {
      if (raw.length < 11) {
        return;
      }
      packet.subNum = toDecimal(raw);
      packet.sub = [];
      packet = { parent: packet };
    }
    return ['version', packet];
  },
  exit: () => {},
};

export const part2 = (rows) => {
  let mode = 'version';
  let raw = [];

  let packet = {};

  for (let i = 0; i < rows[0].length; ++i) {
    let c = rows[0][i];
    const bin = TO_BIN[c];
    for (let j = 0; j < bin.length; ++j) {
      let bit = bin[j];

      raw.push(bit);

      packet.len = (packet.len || 0) + 1;

      const handlerRes = handlers[mode](raw, packet);
      let [nextMode, nextPacket] = Array.isArray(handlerRes) ? handlerRes : [handlerRes, packet];
      packet = nextPacket;
      if (nextMode) {
        mode = nextMode;
        raw = [];
      }
    }
  }
  return calcValue(packet);
};

const calcValue = (packet) => {
  const { typeId, value, sub } = packet;
  if (typeId === 0) {
    return Reducer.sumOfItems(sub.map(calcValue));
  }
  if (typeId === 1) {
    return Reducer.productOfItems(sub.map(calcValue));
  }
  if (typeId === 2) {
    return Math.min(...sub.map(calcValue));
  }
  if (typeId === 3) {
    return Math.max(...sub.map(calcValue));
  }
  if (typeId === 4) {
    return value;
  }
  if (typeId === 5) {
    return calcValue(sub[0]) > calcValue(sub[1]) ? 1 : 0;
  }
  if (typeId === 6) {
    return calcValue(sub[0]) < calcValue(sub[1]) ? 1 : 0;
  }
  if (typeId === 7) {
    return calcValue(sub[0]) === calcValue(sub[1]) ? 1 : 0;
  }
  return 0;
};
