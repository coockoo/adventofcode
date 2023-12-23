from os import path


def k(x: int, y: int) -> str:
    return f"{x},{y}"


def n(m: dict, x: int, y: int) -> list[tuple[int, int]]:
    pn = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
    return [i for i in pn if m.get(k(*i)) == "."]


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        m = {}
        s = None
        for y, line in enumerate(lines):
            for x, c in enumerate(line):
                if c == "S":
                    s = (x, y)
                m[k(x, y)] = "." if c == "S" else c

        q = [s]
        for i in range(64):
            nq = set()
            for p in q:
                for nn in n(m, *p):
                    nq.add(nn)
            q = list(nq)
        print(len(q))


main()
