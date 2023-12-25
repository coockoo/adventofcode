from os import path


def k(x: int, y: int, z: int) -> str:
    return f"{x},{y},{z}"


class Scene:
    def __init__(self):
        self.m = {}

    def can_drop(self, b: "Brick", z: int) -> bool:
        if z == 0:
            return False
        for x in range(b.xf, b.xt + 1):
            for y in range(b.yf, b.yt + 1):
                if self.m.get(k(x, y, z)):
                    return False
        return True

    def drop(self, b: "Brick"):
        z = b.z
        for pz in range(b.z, 0, -1):
            if not self.can_drop(b, pz - 1):
                z = pz
                break

        deps = set()
        for x in range(b.xf, b.xt + 1):
            for y in range(b.yf, b.yt + 1):
                for dz in range(z, z + b.h):
                    self.m[k(x, y, dz)] = b.id
                dep = self.m.get(k(x, y, z - 1))
                if dep:
                    deps.add(dep)

        return list(deps)


class Brick:
    next_id = 1

    def __init__(self, xf: int, xt: int, yf: int, yt: int, z: int, h: int):
        self.xf = xf
        self.xt = xt

        self.yf = yf
        self.yt = yt

        self.z = z

        self.h = h
        self.id = Brick.next_id
        Brick.next_id += 1

    def is_vertical(self):
        return self.xf == self.xt and self.yf == self.yt

    def __repr__(self):
        x = f"{self.xf}" if self.xf == self.xt else f"{self.xf},{self.xt}"
        y = f"{self.yf}" if self.yf == self.yt else f"{self.yf},{self.yt}"
        return f"{{id={self.id},x={x},y={y},z={self.z},h={self.h}}}"


def parse_line(line: str) -> "Brick":
    f, t = line.split("~")
    xf, yf, zf = [int(i) for i in f.split(",")]
    xt, yt, zt = [int(i) for i in t.split(",")]

    return Brick(
        min(xf, xt),
        max(xf, xt),
        min(yf, yt),
        max(yf, yt),
        min(zf, zt),
        max(zf, zt) - min(zf, zt) + 1,
    )


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        bs = [parse_line(line) for line in lines]
        bs.sort(key=lambda b: b.z)

        s = Scene()

        res = set()
        required = set()

        for i in range(len(bs)):
            b = bs[i]
            deps = s.drop(b)
            if len(deps) > 1:
                for d in deps:
                    res.add(d)
            else:
                for d in deps:
                    required.add(d)

        required = list(required)
        for r in required:
            res.discard(r)
        res = list(res)

        t = sum(1 for b in bs if b.id not in res and b.id not in required)

        print("Part 1", len(res) + t)


main()
