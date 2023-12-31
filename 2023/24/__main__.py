from os import path
from sys import argv

mode = argv[1] if len(argv) > 1 else "input"
area_from = 200000000000000 if mode != "demo" else 7
area_to = 400000000000000 if mode != "demo" else 27

Data = tuple[int, int, int, int, int, int]


def val_in_future(v0: float, dv: float, v: float) -> bool:
    return (dv > 0 and v > v0) or (dv < 0 and v <= v0)


def in_area(x, y) -> bool:
    return area_from <= x <= area_to and area_from <= y <= area_to


def parse(lines: list[str]) -> list[Data]:
    ps = []
    for line in lines:
        l, r = line.split("@")
        x, y, z = [int(i) for i in l.strip().split(", ")]
        dx, dy, dz = [int(i) for i in r.strip().split(", ")]
        ps.append((x, y, z, dx, dy, dz))
    return ps


class Vec:
    def __init__(self, x: float, y: float, dx: float, dy: float):
        self.x = x
        self.y = y
        self.dx = dx
        self.dy = dy

    def translateV(self, dx: float, dy: float) -> "Vec":
        self.dx -= dx
        self.dy -= dy
        return self

    def hits(self, x: float, y: float) -> bool:
        diff = (x - self.x) * self.dy - (y - self.y) * self.dx
        return abs(diff) <= 0.0001

    def in_future(self, x: float, y: float) -> bool:
        return val_in_future(self.x, self.dx, x) and val_in_future(self.y, self.dy, y)


# https://stackoverflow.com/a/2932601/1162326
def intersect(a: Vec, b: Vec) -> tuple[float, float]:
    dx = b.x - a.x
    dy = b.y - a.y
    det = b.dx * a.dy - b.dy * a.dx
    if det == 0:
        return None
    u = (dy * b.dx - dx * b.dy) / det
    v = (dy * a.dx - dx * a.dy) / det
    return (round(a.x + a.dx * u, 3), round(b.y + b.dy * v, 3))


def xy_fn(p: Data) -> Vec:
    return Vec(p[0], p[1], p[3], p[4])


def xz_fn(p: Data) -> Vec:
    return Vec(p[0], p[2], p[3], p[5])


def part1(ps: list[Data]) -> int:
    res = 0
    for idx, p1 in enumerate(ps):
        v1 = xy_fn(p1)
        for p2 in ps[idx + 1:]:
            v2 = xy_fn(p2)

            poi = intersect(v1, v2)
            if not poi:
                continue
            x, y = poi

            if in_area(x, y) and v1.in_future(x, y) and v2.in_future(x, y):
                res += 1
    return res


def solve(ps: list[Data], vec_fn) -> float:
    speed_range = 300
    for dx in range(-speed_range, speed_range + 1):
        for dy in range(-speed_range, speed_range + 1):
            if dx == 0 or dy == 0:
                continue

            stone = intersect(
                vec_fn(ps[0]).translateV(dx, dy),
                vec_fn(ps[2]).translateV(dx, dy),
            )
            if not stone:
                continue

            if all(vec_fn(p).translateV(dx, dy).hits(*stone) for p in ps):
                return stone


def main():
    inp = path.join(path.dirname(__file__), f"{mode}.txt")
    lines = list(line for line in open(inp) if line)

    ps = parse(lines)

    print("Part 1", part1(ps))

    xy = solve(ps, xy_fn)
    xz = solve(ps, xz_fn)

    print("Part 2", int(xy[0] + xy[1] + xz[1]))


main()
