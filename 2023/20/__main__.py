from os import path


class Flip:
    def __init__(self):
        self.state = 0
        self.output = []

    def receive(self, f: str, pulse: str):
        if pulse == 'h':
            return
        if pulse == 'l':
            prev = self.state
            self.state = 1 - self.state
            if prev == 0:
                self.output.append('h')
            if prev == 1:
                self.output.append('l')

    def send(self):
        res = self.output
        self.output = []
        return [res[-1]] if len(res) else []


class Conj:
    def __init__(self):
        self.inputs = {}

    def add_input(self, input: str):
        self.inputs[input] = False

    def receive(self, f: str, pulse: str):
        self.inputs[f] = pulse == 'h'

    def send(self):
        res = 'l' if all(self.inputs.values()) else 'h'
        return [res]


class Bro:
    def __init__(self):
        self.pulse = 'l'

    def receive(self, f: str, pulse: str):
        self.pulse = pulse

    def send(self):
        return [self.pulse]


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        d = {}
        for line in lines:
            f, t = line.split(' -> ')
            t = t.split(', ')
            if line.startswith('%'):
                f = f[1:]
                d[f] = (Flip(), t)
            if line.startswith('&'):
                f = f[1:]
                d[f] = (Conj(), t)
            if line.startswith('b'):
                d[f] = (Bro(), t)

        conjs = [(k, v[0]) for k, v in d.items() if isinstance(v[0], Conj)]

        for k, c in conjs:
            for inp, val in d.items():
                if k in val[1]:
                    c.add_input(inp)

        def run():
            lows = 1
            highs = 0
            q = ['broadcaster']
            idx = 0
            while len(q):
                idx += 1
                c = q.pop(0)
                h, next = d.get(c)
                pulses = h.send()
                for n in next:
                    for p in pulses:
                        if p == 'l':
                            lows += 1
                        if p == 'h':
                            highs += 1
                        # print(f'{idx}: {c} -{p}-> {n}')
                        dn = d.get(n)
                        if dn:
                            dn[0].receive(c, p)
                            q.append(n)
                        else:
                            if p == 'l':
                                print(f'{idx}: {c} -{p}-> {n}')
            return lows, highs

        lows = 0
        highs = 0
        for i in range(1000):
            l, h = run()
            # print(l, h)
            lows += l
            highs += h
        print('Part 1', lows * highs)



main()
