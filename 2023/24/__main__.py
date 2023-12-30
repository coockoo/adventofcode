from os import path
from sys import argv

mode = argv[1] if len(argv) > 1 else "input"
area_from = 200000000000000 if mode != "demo" else 7
area_to = 400000000000000 if mode != "demo" else 27

Data = tuple[int, int, int, int, int, int]


def calc_a_b(x, y, z, dx, dy, dz) -> tuple[float, float]:
    a = dy / dx
    b = y - a * x
    return a, b


def val_in_future(v0: float, dv: float, v: float) -> bool:
    return (dv > 0 and v > v0) or (dv < 0 and v <= v0)


def in_future(x, y, z, dx, dy, dz, tx, ty) -> bool:
    return val_in_future(x, dx, tx) and val_in_future(y, dy, ty)


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


def intersect(p1: Data, p2: Data) -> bool:
    x1, y1, z1, dx1, dy1, dz1 = p1
    a1, b1 = calc_a_b(*p1)

    x2, y2, z2, dx2, dy2, dz2 = p2
    a2, b2 = calc_a_b(*p2)

    if a1 == a2:
        return None

    x = (b2 - b1) / (a1 - a2)
    y = a1 * x + b1

    if not in_future(*p1, x, y):
        return None

    if not in_future(*p2, x, y):
        return None

    return (x, y)


def part1(ps: list[Data]) -> int:
    res = 0
    for idx, p1 in enumerate(ps):
        x1, y1, z1, dx1, dy1, dz1 = p1
        a1, b1 = calc_a_b(*p1)
        for p2 in ps[idx + 1:]:
            x2, y2, z2, dx2, dy2, dz2 = p2
            a2, b2 = calc_a_b(*p2)

            if a1 == a2:
                continue
            x = (b2 - b1) / (a1 - a2)
            y = a1 * x + b1

            if in_area(x, y) and in_future(*p1, x, y) and in_future(*p2, x, y):
                res += 1
    return res


def main():
    inp = path.join(path.dirname(__file__), f"{mode}.txt")
    lines = list(line for line in open(inp) if line)

    ps = parse(lines)

    print("Part 1", part1(ps))
    return

    speed_range = 500
    for dx in range(-speed_range, speed_range + 1):
        for dy in range(-speed_range, speed_range + 1):
            if dx == 0:
                continue

            a = dy / dx

            for idx, p1 in enumerate(ps):
                x1, y1, z1, dx1, dy1, dz1 = p1
                a1, b1 = calc_a_b(*p1)
                for p2 in ps[idx + 1:]:
                    x2, y2, z2, dx2, dy2, dz2 = p2
                    a2, b2 = calc_a_b(*p2)


main()
