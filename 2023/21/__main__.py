from os import path


def k(x: int, y: int) -> str:
    return f"{x},{y}"


def get_ns(
    m: dict, x: int, y: int, ms: tuple[int, int] = None
) -> list[tuple[int, int]]:
    pn = [
        (x - 1, y),
        (x + 1, y),
        (x, y - 1),
        (x, y + 1),
    ]

    def get_p(i: tuple[int, int]):
        return norm(ms, i) if ms else i

    return [i for i in pn if m.get(k(*get_p(i))) == "."]


def norm(ms: tuple[int, int], p: tuple[int, int]) -> tuple[int, int]:
    if not ms:
        return p
    return ((p[0] + ms[0]) % ms[0], (p[1] + ms[1]) % ms[1])


def parse(lines: list[str]) -> tuple[dict, tuple[int, int], tuple[int, int]]:
    m = {}
    s = None
    ms = (len(lines[0]), len(lines))
    for y, line in enumerate(lines):
        for x, c in enumerate(line):
            if c == "S":
                s = (x, y)
            m[k(x, y)] = "." if c == "S" else c
    return m, s, ms


def solve(m: dict, s: tuple[int, int], ms: tuple[int, int], steps: int) -> int:
    q = [s]
    v = {}
    res = 0
    for i in range(steps):
        print(i, len(q))
        nq = set()
        is_count = i % 2 == (steps + 1) % 2

        for p in q:
            for nb in get_ns(m, *p, ms):
                if not v.get(k(*nb)):
                    nq.add(nb)
                    v[k(*nb)] = True
        if is_count:
            res += len(nq)
        q = list(nq)

    return res


def main():
    inp = path.join(path.dirname(__file__), "demo.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        m, s, ms = parse(lines)

        # print("Part 1", solve(m, s, None, 64))
        print("Part 2", solve(m, s, ms, 5000))


main()
