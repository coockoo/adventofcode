from os import path


class Range:
    def __init__(self, values: dict = None):
        self.values = values or {
            "x": (1, 4000),
            "m": (1, 4000),
            "a": (1, 4000),
            "s": (1, 4000),
        }

    def cut(self, attr: str, op: str, val: int, reverse: bool = False):
        next = self.values.copy()
        opp = self.values.copy()

        prev = self.values.get(attr)

        if op == ">":
            next[attr] = (max(val + 1, prev[0]), prev[1])
            opp[attr] = (prev[0], min(val, prev[1]))
        if op == "<":
            next[attr] = (prev[0], min(val - 1, prev[1]))
            opp[attr] = (max(val, prev[0]), prev[1])
        return Range(next), Range(opp)

    def __repr__(self):
        def fmt(val: str):
            v = self.values.get(val)
            left = str(v[0]).rjust(4, " ")
            right = str(v[1]).rjust(4, " ")
            return f"{left}<={val}<={right}"

        return "{" + ";".join([fmt("x"), fmt("m"), fmt("a"), fmt("s")]) + "}"

    def value(self):
        def get_v(val: str):
            v = self.values.get(val)
            t = v[1] - v[0] + 1
            return t

        return get_v("x") * get_v("m") * get_v("a") * get_v("s")


def part1(parts, cmds):
    res = 0
    for part in parts:
        current = "in"
        while True:
            if current == "A":
                res += sum(part.values())
                break
            if current == "R":
                break
            rules = cmds.get(current)
            for rule in rules:
                k, op, val, to = rule
                if k is None:
                    current = to
                if op == "<" and part.get(k) < val:
                    current = to
                    break
                if op == ">" and part.get(k) > val:
                    current = to
                    break
    return res


def part2(parts, cmds):
    q = [("in", Range())]
    res = []
    while len(q):
        name, opp = q.pop()
        for cmd in cmds.get(name):
            k, op, val, to = cmd
            next, opp = opp.cut(k, op, val) if k else (opp, None)
            if to == "A":
                res.append(next)
            elif to != "R":
                q.append((to, next))

    return sum(i.value() for i in res)


def parse_rule(rule: str) -> tuple[str, str, int]:
    if "<" in rule:
        k, v = rule.split("<")
        v, t = v.split(":")
        return (k, "<", int(v), t)
    if ">" in rule:
        k, v = rule.split(">")
        v, t = v.split(":")
        return (k, ">", int(v), t)
    return (None, None, None, rule)


def parse(lines: list[str]) -> tuple[list[dict], dict]:
    parts = []
    cmds = {}
    for line in lines:
        if line.startswith("{"):
            params = line[1:-1].split(",")
            d = {}
            for p in params:
                key, val = p.split("=")
                d[key] = int(val)
            parts.append(d)
        else:
            key, rules = line.split("{")
            rules = rules[:-1].split(",")
            rules = [parse_rule(rule) for rule in rules]
            cmds[key] = rules
    return parts, cmds


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        parts, cmds = parse(lines)
        print("Part 1", part1(parts, cmds))
        print("Part 2", part2(parts, cmds))


main()
