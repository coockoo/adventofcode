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

  const validTickets = [];

  const ranges = Object.values(criteria).flat();
  for (let i = 0; i < tickets.length; ++i) {
    const ticket = tickets[i];

    for (let j = 0; j < ticket.length; ++j) {
      const value = ticket[j];
      const range = ranges.find(([from, to]) => {
        return value >= from && value <= to;
      });
      if (!range) {
        errorRate += value;
      }
    }
  }

  console.log('Part 1: %d', errorRate);
}

main().catch(console.error);
