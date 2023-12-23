# note: dude, this task was hard. it had some:
# - matplotlib visualizations
# - manual work
# - just randomly trying stuff
# - breaks for thinking
# - lots of debugging and print()-ing stuff
from os import path
from math import lcm


class Flip:
    def __init__(self, name: str):
        self.name = name
        self.state = 0
        self.output = None

    def receive(self, f: str, pulse: str):
        if pulse == 'h':
            return
        if pulse == 'l':
            prev = self.state
            self.state = 1 - self.state
            if prev == 0:
                self.output = 'h'
            if prev == 1:
                self.output = 'l'

    def send(self):
        res = self.output
        self.output = None
        return res

    def __repr__(self):
        return f'flip({self.name})->{self.state}'


class Conj:
    def __init__(self, name: str):
        self.name = name
        self.inputs = {}

    def add_input(self, input: str):
        self.inputs[input] = False

    def receive(self, f: str, pulse: str):
        self.inputs[f] = pulse == 'h'

    def send(self):
        return 'l' if all(self.inputs.values()) else 'h'

    def __repr__(self):
        vals = ','.join(f'{k}={v}' for (k, v) in self.inputs.items())
        return 'conj(' + self.name + ')->' + vals


class Bro:
    def __init__(self, name: str):
        self.name = name
        self.pulse = 'l'

    def receive(self, f: str, pulse: str):
        self.pulse = pulse

    def send(self):
        return self.pulse

    def __repr__(self):
        return 'bro(' + self.name + ')->' + self.pulse


def all_equal(lst: list[int]):
    return all(lst[i] == lst[i - 1] for i in range(1, len(lst)))


def get_loop(lst: list[int]):
    loops = []
    current = []
    for i in range(len(lst)):
        current.clear()
        current.append(lst[i])
        for j in range(i + 1, len(lst)):
            if (lst[j] == current[0] and lst[j] != current[-1]) or len(current) > 16:
                t = ','.join(str(c) for c in current)
                if t in loops:
                    return [current[0]] if all_equal(current) else current
                loops.append(t)
                break
            else:
                current.append(lst[j])


def parse(lines: list[str]) -> dict:
    d = {}
    for line in lines:
        f, t = line.split(' -> ')
        t = t.split(', ')
        if line.startswith('%'):
            f = f[1:]
            d[f] = (Flip(f), t)
        if line.startswith('&'):
            f = f[1:]
            d[f] = (Conj(f), t)
        if line.startswith('b'):
            d[f] = (Bro(f), t)

    conjs = [(k, v[0]) for k, v in d.items() if isinstance(v[0], Conj)]

    for k, c in conjs:
        for inp, val in d.items():
            if k in val[1]:
                c.add_input(inp)
    return d


def run(d: dict):
    lows = 1
    highs = 0
    q = ['broadcaster']
    while len(q):
        c = q.pop(0)
        h, next = d.get(c)
        p = h.send()
        if not p:
            continue
        for n in next:
            if p == 'l':
                lows += 1
            if p == 'h':
                highs += 1
            dn = d.get(n)
            if dn:
                dn[0].receive(c, p)
                q.append(n)
    return lows, highs


def get_inputs(d: dict, src: list[str]) -> list[str]:
    n_src = []
    for i in src:
        for j in d.get(i)[0].inputs.keys():
            n_src.append(j)
    return n_src


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        d = parse(lines)

        # todo: manual work rx -> ft
        src = list(d.get('ft')[0].inputs.keys())
        src = get_inputs(d, src)
        src = get_inputs(d, src)

        t = {}

        for i in src:
            t[i] = {'cur': d.get(i)[0].state, 'cnt': 1, 'arr': []}

        lows = 0
        highs = 0
        for idx in range(11000):
            l, h = run(d)
            if idx < 1000:
                lows += l
                highs += h
            for i in src:
                n = d.get(i)[0].state
                if t[i].get('cur') != n:
                    t[i]['cur'] = n
                    t[i]['arr'].append(t[i].get('cnt'))
                    t[i]['cnt'] = 1
                else:
                    t[i]['cnt'] += 1
        res = []
        for k, v in t.items():
            loop = get_loop(v.get('arr'))
            # don't count stuff that is repetative
            if len(loop) > 1:
                res.append(sum(loop))

        print('Part 1', lows * highs)
        print('Part 2', lcm(*res))


main()
