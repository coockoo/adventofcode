def get_key(x: int, y: int) -> str:
    return str(x) + ':' + str(y)


def dist(g1, g2, er, ec, factor):
    if g1 == g2:
        return 0

    res = abs(g1[0] - g2[0]) + abs(g1[1] - g2[1])

    for i in ec:
        if min(g1[0], g2[0]) < i and i < max(g1[0], g2[0]):
            res += factor - 1

    for i in er:
        if min(g1[1], g2[1]) < i and i < max(g1[1], g2[1]):
            res += factor - 1
    return res


def parse(lines):
    map = {}
    galaxies = []
    size = (len(lines[0]), len(lines) - 1)

    for y, line in enumerate(lines):
        if not line:
            continue
        for x, c in enumerate(line):
            k = get_key(x, y)
            map[k] = c
            if c == '#':
                galaxies.append((x, y))

    return map, galaxies, size


def expand(map, size):
    empty_rows = []
    for y in range(size[1]):
        if all(map.get(get_key(x, y)) == '.' for x in range(size[0])):
            empty_rows.append(y)

    empty_cols = []
    for x in range(size[0]):
        if all(map.get(get_key(x, y)) == '.' for y in range(size[1])):
            empty_cols.append(x)

    return empty_rows, empty_cols


def solve(galaxies, er, ec, factor):
    res = 0
    for idx1, g1 in enumerate(galaxies):
        for idx2 in range(idx1 + 1, len(galaxies)):
            g2 = galaxies[idx2]
            res += dist(g1, g2, er, ec, factor)
    return res


def main():
    with open('./2023/11/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        map, galaxies, size = parse(lines)
        empty_rows, empty_cols = expand(map, size)

        print('part 1', solve(galaxies, empty_rows, empty_cols, 2))
        print('part 2', solve(galaxies, empty_rows, empty_cols, 1000000))


main()
