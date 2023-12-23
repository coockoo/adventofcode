from os import path


class Range:
    def __init__(self, values: dict = None):
        self.values = values or {
            'x': None,
            'm': None,
            'a': None,
            's': None,
        }

    def cut(self, attr: str, op: str, val: int, reverse: bool = False):
        next = self.values.copy()
        prev = self.values.get(attr) if self.values.get(attr) else (0, 4000)

        if op == '>':
            if reverse:
                next[attr] = (prev[0], min(val, prev[1]))
            else:
                next[attr] = (max(val + 1, prev[0]), prev[1])
        if op == '<':
            if reverse:
                next[attr] = (max(val, prev[0]), prev[1])
            else:
                next[attr] = (prev[0], min(val - 1, prev[1]))
        return Range(next)

    def copy(self):
        return Range(self.values.copy())

    def __repr__(self):
        return f'{self.values}'


def part1(parts, cmds):
    res = 0
    for part in parts:
        current = 'in'
        while True:
            if current == 'A':
                res += sum(part.values())
                break
            if current == 'R':
                break
            rules = cmds.get(current)
            for rule in rules:
                k, op, val, to = rule
                if k is None:
                    current = to
                if op == '<' and part.get(k) < val:
                    current = to
                    break
                if op == '>' and part.get(k) > val:
                    current = to
                    break
    return res


def main():
    inp = path.join(path.dirname(__file__), 'demo.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        parts, cmds = parse(lines)
        # print('Part 1', part1(parts, cmds))

        q = [('in', Range())]
        res = []
        while len(q):
            name, r = q.pop()
            # print('name', name, r)
            opp = r
            for cmd in cmds.get(name):
                # print('cmd', cmd)
                k, op, val, to = cmd
                if not k:
                    if to == 'A':
                        # print('approve no key')
                        res.append(r)
                    elif to == 'R':
                        None
                        # print('reject no key')
                    else:
                        # print('no kep append opp', to, opp)
                        q.append((to, opp))
                else:
                    next = r.cut(k, op, val)
                    # print('next', next)
                    opp = opp.cut(k, op, val, True)
                    if to == 'A':
                        # print('approve cut')
                        res.append(next)
                    elif to == 'R':
                        None
                        # print('reject cut')
                    else:
                        # print('queue cut', to)
                        q.append((to, next))

        print('res', [i.values.get('x') for i in res])
        print((1415 - 0 + 4000 - 2663) * 4000 * 4000 * 4000)


def parse_rule(rule: str) -> tuple[str, str, int]:
    if '<' in rule:
        k, v = rule.split('<')
        v, t = v.split(':')
        return (k, '<', int(v), t)
    if '>' in rule:
        k, v = rule.split('>')
        v, t = v.split(':')
        return (k, '>', int(v), t)
    return (None, None, None, rule)


def parse(lines: list[str]) -> tuple[list[dict], dict]:
    parts = []
    cmds = {}
    for line in lines:
        if line.startswith('{'):
            params = line[1:-1].split(',')
            d = {}
            for p in params:
                key, val = p.split('=')
                d[key] = int(val)
            parts.append(d)
        else:
            key, rules = line.split('{')
            rules = rules[:-1].split(',')
            rules = [parse_rule(rule) for rule in rules]
            cmds[key] = rules
    return parts, cmds


main()
