from os import path


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
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        parts, cmds = parse(lines)
        print('Part 1', part1(parts, cmds))


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
