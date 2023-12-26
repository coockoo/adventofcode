from os import path


def calc_a_b(x, y, z, dx, dy, dz) -> tuple[float, float]:
    a = (y - (y + dy)) / (x - (x + dx))
    b = y + dy - a * (x + dx)
    return a, b


def in_future(x, y, z, dx, dy, dz, tx, ty) -> tuple[float, float]:
    x_in_future = (dx > 0 and tx >= x) or (dx < 0 and tx <= x)
    y_in_future = (dy > 0 and ty >= y) or (dy < 0 and ty <= y)
    return x_in_future and y_in_future


def main():
    part = "input"
    inp = path.join(path.dirname(__file__), f"{part}.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        ps = []
        for line in lines:
            l, r = line.split("@")
            x, y, z = [int(i) for i in l.strip().split(", ")]
            dx, dy, dz = [int(i) for i in r.strip().split(", ")]
            ps.append((x, y, z, dx, dy, dz))

        res = 0
        fr = 200000000000000 if part != "demo" else 7
        to = 400000000000000 if part != "demo" else 27
        # print(fr, to)
        i = 0
        for idx, p1 in enumerate(ps):
            x1, y1, z1, dx1, dy1, dz1 = p1
            a1, b1 = calc_a_b(*p1)
            for p2 in ps[idx + 1:]:
                i += 1
                x2, y2, z2, dx2, dy2, dz2 = p2
                a2, b2 = calc_a_b(*p2)

                # print(*p1)
                # print(*p2)

                if a1 == a2:
                    # print("never intersect")
                    continue
                x = (b2 - b1) / (a1 - a2)
                y = a1 * x + b1

                # print(x, y)

                is_in_area = fr <= x and x <= to and fr <= y and y <= to
                if not is_in_area:
                    # print("not in area")
                    continue

                if not in_future(*p1, x, y):
                    # print("a in past")
                    continue

                if not in_future(*p2, x, y):
                    # print("b in past")
                    continue

                # print("MATCH")
                res += 1
        print(res)


main()
