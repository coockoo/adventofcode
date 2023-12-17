from os import path
from functools import cmp_to_key


class cursor:
    def __init__(
        self,
        x: int,
        y: int,
        dir: str,
        steps: int = 0,
    ):
        self.x = x
        self.y = y
        self.dir = dir
        self.steps = steps

    def get_next(self, m: dict) -> list['cursor']:
        next = []
        if self.dir != 'r':
            steps = self.steps + 1 if self.dir == 'l' or not self.dir else 0
            next.append(cursor(self.x - 1, self.y, 'l', steps))
        if self.dir != 'l':
            steps = self.steps + 1 if self.dir == 'r' or not self.dir else 0
            next.append(cursor(self.x + 1, self.y, 'r', steps))
        if self.dir != 'd':
            steps = self.steps + 1 if self.dir == 'u' or not self.dir else 0
            next.append(cursor(self.x, self.y - 1, 'u', steps))
        if self.dir != 'u':
            steps = self.steps + 1 if self.dir == 'd' or not self.dir else 0
            next.append(cursor(self.x, self.y + 1, 'd', steps))
        return list(i for i in next if i.is_in(m))

    def is_in(self, m: dict):
        return bool(m.get(self.get_key()) and self.steps < 3)

    def to_finish(self, s: tuple[int, int]) -> int:
        return abs(self.x - s[0]) + abs(self.y - s[1])

    def get_key(self):
        return f'{self.x}:{self.y}'

    def get_v_key(self):
        return f'{self.x}:{self.y}:{self.dir}:{self.steps}'

    def __repr__(self):
        return f'({self.x},{self.y});dir={self.dir};steps={self.steps}'


def k(x: int, y: int) -> str:
    return f'{x}:{y}'


def show(f, s: tuple[int, int]):
    t = '\n'.join(''.join(str(f.get(k(x, y))).rjust(4, ' ') for x in range(s[0])) for y in range(s[1]))
    print(t)


def sort_fn(v: dict, s: tuple[int, int], a: cursor, b: cursor) -> int:
    return v.get(a.get_v_key()) - v.get(b.get_v_key())


def part1(lines: list[str]) -> int:
    m = {}
    s = (len(lines[0]), len(lines))
    for y, line in enumerate(lines):
        for x, c in enumerate(line):
            m[k(x, y)] = int(c)

    ic = cursor(0, 0, None, 0)
    q = [ic]
    v = {ic.get_v_key(): 0}
    wk = k(len(lines[0]) - 1, len(lines) - 1)
    while len(q):
        c = q.pop()
        next = c.get_next(m)
        cval = v.get(c.get_v_key())
        if c.get_key() == wk:
            return cval
        for n in next:
            nval = v.get(n.get_v_key())
            mval = m.get(n.get_key())
            if not nval or nval > mval + cval:
                v[n.get_v_key()] = mval + cval
                q.append(n)
        q = sorted(q, key=cmp_to_key(lambda a, b: -sort_fn(v, s, a, b)))


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        print('Part 1', part1(lines))


main()
