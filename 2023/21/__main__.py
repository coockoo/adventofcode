from os import path


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

    return [i for i in pn if m.get(get_p(i)) == "."]


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
            m[(x, y)] = "." if c == "S" else c
    return m, s, ms


def solve(m: dict, s: tuple[int, int], ms: tuple[int, int], steps: int) -> int:
    q = [s]
    v = {}
    res = 0
    for i in range(steps):
        nq = set()
        is_count = i % 2 == (steps + 1) % 2

        for p in q:
            for nb in get_ns(m, *p, ms):
                if not v.get(nb):
                    nq.add(nb)
                    v[nb] = True
        if is_count:
            res += len(nq)
        q = list(nq)

    return res


def part2(m, s, ms) -> int:
    # solution to this part was influenced by this article
    # https://aoc.csokavar.hu/?day=21
    # I really need to recall some of the algebra.
    # TODO: understand how this thing works and why and write
    # explanation article about it. I need to know.
    # I feel bad for doing this
    # Task can be either super easy or super hard depending on wether
    # you know theory or not
    x0 = 65
    y0 = solve(m, s, ms, x0)
    x1 = 131 + 65
    y1 = solve(m, s, ms, x1)
    x2 = 2 * 131 + 65
    y2 = solve(m, s, ms, 131 * 2 + 65)

    y01 = (y1 - y0) / (x1 - x0)
    y12 = (y2 - y1) / (x2 - x1)
    y012 = (y12 - y01) / (x2 - x0)

    n = 26501365
    return int(y0 + y01 * (n - x0) + y012 * (n - x0) * (n - x1))


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        m, s, ms = parse(lines)

        print("Part 1", solve(m, s, None, 64))
        print("Part 2", part2(m, s, ms))


main()
