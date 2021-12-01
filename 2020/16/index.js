const fs = require('fs');
const path = require('path');

async function main() {
  const content = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');

  const criteria = {};
  let mode = null;
  let myTicket = null;
  let tickets = [];

  content
    .split(/\n/g)
    .filter((i) => i)
    .forEach((raw) => {
      const criteriaMatch = raw.match(/^([a-z\s]+): (\d+)-(\d+) or (\d+)-(\d+)$/);
      if (criteriaMatch) {
        criteria[criteriaMatch[1]] = [
          [+criteriaMatch[2], +criteriaMatch[3]],
          [+criteriaMatch[4], +criteriaMatch[5]],
        ];
        return;
      }

      const isYourMatch = raw.match(/^your ticket:$/);
      if (isYourMatch) {
        mode = 'your';
        return;
      }

      const isOtherMatch = raw.match(/^nearby tickets:$/);
      if (isOtherMatch) {
        mode = 'other';
        return;
      }

      const ticketMatch = raw.match(/^(?:\d+,)*\d+$/);
      if (ticketMatch) {
        const ticket = raw.split(/,/g).map((i) => +i);
        if (mode === 'your') {
          myTicket = ticket;
        }
        if (mode === 'other') {
          tickets.push(ticket);
        }
        return;
      }
    });

  let errorRate = 0;

  tickets.forEach((ticket) => {
    ticket.forEach((value) => {
      const isValid = isValidValue(value, criteria);
      if (!isValid) {
        errorRate += value;
      }
    });
  });

  console.log('Part 1: %d', errorRate);

  const validTickets = [];
  tickets.forEach((ticket) => {
    const isValid = isValidTicket(ticket, criteria);
    if (isValid) {
      validTickets.push(ticket);
    }
  });

  console.log('There are %d valid tickets', validTickets.length);

  const counts = {};
  Object.keys(criteria).forEach((key) => {
    counts[key] = {};
  });

  validTickets.forEach((ticket) => {
    ticket.forEach((value, index) => {
      Object.entries(criteria).some(([key, ranges]) => {
        const isIn = isInRange(value, ranges);
        if (isIn) {
          counts[key][index] = (counts[key][index] || 0) + 1;
        }
      });
    });
  });

  const finalCounts = {};
  while (Object.keys(counts).length > 0) {
    Object.entries(counts).forEach(([key, iCounts]) => {
      let maxCount = 0;
      let oneIdx = null;
      Object.entries(iCounts).forEach(([idx, count]) => {
        if (count === validTickets.length) {
          maxCount += 1;
          oneIdx = idx;
        }
      });

      if (maxCount === 1) {
        finalCounts[key] = oneIdx;
        Object.keys(counts).forEach((k) => {
          delete counts[k][oneIdx];
        });
        delete counts[key];
      }
    });
  }

  let res = 1;
  Object.entries(finalCounts).forEach(([key, idx]) => {
    if (key.match(/^departure /)) {
      res *= myTicket[idx];
    }
  });

  console.log('Part 2: %d', res);
}

function isValidTicket(ticket, criteria) {
  return ticket.every((value) => isValidValue(value, criteria));
}

function isValidValue(value, criteria) {
  return Object.entries(criteria).some(([_, ranges]) => {
    return isInRange(value, ranges);
  });
}

function isInRange(value, ranges) {
  return ranges.some(([from, to]) => {
    return value >= from && value <= to;
  });
}

main().catch(console.error);
