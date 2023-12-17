from os import path
from functools import cmp_to_key


class cursor:
    def __init__(
        self,
        x: int,
        y: int,
        dir: str = '',
        val: int = float('inf')  # lul
    ):
        self.x = x
        self.y = y
        self.dir = dir
        self.val = val

    def get_next(self, rf: int, rt: int, m: dict) -> list['cursor']:
        next = []

        def fill(get_p, d: str):
            t = self.val
            for i in range(1, rt):
                p = get_p(i)
                mv = m.get(k(*p))
                if mv is None:
                    break
                t += mv
                if i >= rf:
                    next.append(cursor(*p, d, t))

        if not self.dir or self.dir == 'u' or self.dir == 'd':
            fill(lambda i: (self.x - i, self.y), 'l')
            fill(lambda i: (self.x + i, self.y), 'r')
        if not self.dir or self.dir == 'l' or self.dir == 'r':
            fill(lambda i: (self.x, self.y - i), 'u')
            fill(lambda i: (self.x, self.y + i), 'd')

        return next

    def is_in(self, m: dict):
        return bool(m.get(self.get_key()))

    def get_key(self):
        return f'{self.x}:{self.y}'

    def get_v_key(self):
        d = ''
        if self.dir == 'l' or self.dir == 'r':
            d = 'v'
        if self.dir == 'u' or self.dir == 'd':
            d = 'h'
        return f'{self.x}:{self.y}:{d}'

    def __repr__(self):
        return f'({self.x},{self.y});dir={self.dir};val={self.val}'

    def dist(self, x: int, y: int) -> int:
        return abs(self.x - x) + abs(self.y - y)


def sort_fn(a: cursor, b: cursor) -> int:
    return b.val - a.val


def k(x: int, y: int) -> str:
    return f'{x}:{y}'


def parse(lines: list[str]) -> tuple[dict, tuple[int, int]]:
    m = {}
    for y, line in enumerate(lines):
        for x, c in enumerate(line):
            m[k(x, y)] = int(c)
    return m


def solve(lines: list[str], rf: int, rt: int) -> int:
    m = parse(lines)
    wk = k(len(lines[0]) - 1, len(lines) - 1)

    ic = cursor(0, 0, None, 0)
    q = [ic]
    v = {ic.get_v_key(): 0}

    while len(q):
        c = q.pop()
        next = c.get_next(rf, rt, m)
        if c.get_key() == wk:
            return c.val
        for n in next:
            nk = n.get_v_key()
            vval = v.get(nk)
            if vval is None or n.val < vval:
                v[nk] = n.val
                q.append(n)
        q.sort(key=cmp_to_key(lambda a, b: sort_fn(a, b)))


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        print('Part 1', solve(lines, 1, 4))
        print('Part 2', solve(lines, 4, 11))


main()
