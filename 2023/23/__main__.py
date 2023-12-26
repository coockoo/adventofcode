from os import path


def k(x: int, y: int) -> str:
    return f"{x},{y}"


def get_ns(m: dict, x: int, y: int) -> list[tuple[int, int]]:
    pn = [
        (x - 1, y),
        (x + 1, y),
        (x, y - 1),
        (x, y + 1),
    ]

    return [i for i in pn if m.get(k(*i)) and m.get(k(*i)) != "#"]


class Route:
    def __init__(self, path: list[tuple[int, int]] = []):
        self.path = path

    def go(self, m: dict):
        last = self.path[-1]
        """
        cv = m.get(k(*last))
        nv = None
        if cv == ">":
            nv = (last[0] + 1, last[1])
        elif cv == "<":
            nv = (last[0] - 1, last[1])
        elif cv == "v":
            nv = (last[0], last[1] + 1)
        elif cv == "^":
            nv = (last[0], last[1] - 1)

        if nv:
            if nv not in self.path:
                self.path.append(nv)
                return [self]
            return []
        """

        ns = get_ns(m, *last)
        ns = [n for n in ns if n not in self.path]

        if len(ns) == 1:
            self.path.append(ns[0])
            return [self]

        next = []
        for n in ns:
            nr = Route()
            nr.path = self.path.copy()
            nr.path.append(n)
            next.append(nr)

        return next

    def is_at(self, p: tuple[int, int]):
        return self.path[-1] == p

    def __repr__(self):
        return f"route:{self.path}"


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        m = {}
        s = None
        f = None
        for y, line in enumerate(lines):
            for x, c in enumerate(line):
                if c == ".":
                    if not s:
                        s = (x, y)
                    f = (x, y)
                m[k(x, y)] = c

        f = Route([f])
        while True:
            next = f.go(m)
            if len(next) > 1:
                break
        to_finish = len(f.path) - 1
        f = f.path[-1]

        s = Route([s])
        while True:
            next = s.go(m)
            if len(next) > 1:
                break
        from_start = len(s.path) - 1
        s.path = s.path[-1:]

        q: list[Route] = [s]
        res = 0
        while len(q):
            c = q.pop()
            next = c.go(m)
            for n in next:
                if n.is_at(f):
                    maybe_res = from_start + len(n.path) + to_finish
                    res = max(res, maybe_res)
                    if maybe_res == res:
                        print(res - 1)
                else:
                    q.append(n)
        print(res - 1)


main()
