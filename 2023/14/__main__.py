from os import path


def get_loop(lst: list[int]):
    loops = []
    current = []
    for i in range(len(lst)):
        current.clear()
        current.append(lst[i])
        for j in range(i + 1, len(lst)):
            if len(current) > 3 and lst[j] == current[0]:
                t = ','.join(str(c) for c in current)
                if t in loops:
                    return current, i + 1
                loops.append(t)
                current.clear()
            else:
                current.append(lst[j])


def transpose(rows: list[str]) -> list[str]:
    return [''.join([r[i] for r in rows]) for i in range(len(rows[0]))]


def part1(rows: list[str]) -> int:
    res = 0
    cols = transpose(rows)
    for col in cols:
        w = len(col)
        for idx, c in enumerate(col):
            if c == 'O':
                res += w
                w -= 1
            if c == '#':
                w = len(col) - idx - 1
    return res


def k(x: int, y: int) -> str:
    return f'{x}:{y}'


def part2(rows: list[str]) -> int:
    f = {}
    s = (len(rows[0]), len(rows))
    for y in range(s[1]):
        for x in range(s[0]):
            f[k(x, y)] = rows[y][x]

    t = []
    loop_res = None
    while not loop_res:
        north(f, s)
        west(f, s)
        south(f, s)
        east(f, s)
        w = weight(f, s)
        t.append(w)
        loop_res = get_loop(t)

    loop, loop_from = loop_res
    big = 1000000000
    # -1 to compensate diff between 0 and 1 based counting
    return t[loop_from + (big - loop_from - 1) % len(loop)]


def show(f, s: tuple[int, int]):
    t = '\n'.join(''.join(f.get(k(x, y)) for x in range(s[0])) for y in range(s[1]))
    print(t)


def north(f, s: tuple[int, int]):
    for x in range(s[0]):
        last = 0
        for y in range(s[1]):
            c = f.get(k(x, y))
            if c == 'O':
                f[k(x, y)] = '.'
                f[k(x, last)] = 'O'
                last += 1
            if c == '#':
                last = y + 1


def south(f, s: tuple[int, int]):
    for x in range(s[0]):
        last = s[1] - 1
        for y in reversed(range(s[1])):
            c = f.get(k(x, y))
            if c == 'O':
                f[k(x, y)] = '.'
                f[k(x, last)] = 'O'
                last -= 1
            if c == '#':
                last = y - 1


def west(f, s: tuple[int, int]):
    for y in range(s[1]):
        last = 0
        for x in range(s[0]):
            c = f.get(k(x, y))
            if c == 'O':
                f[k(x, y)] = '.'
                f[k(last, y)] = 'O'
                last += 1
            if c == '#':
                last = x + 1


def east(f, s: tuple[int, int]):
    for y in range(s[1]):
        last = s[0] - 1
        for x in reversed(range(s[0])):
            c = f.get(k(x, y))
            if c == 'O':
                f[k(x, y)] = '.'
                f[k(last, y)] = 'O'
                last -= 1
            if c == '#':
                last = x - 1


def weight(f, s: tuple[int, int]):
    res = 0
    for y in range(s[1]):
        for x in range(s[0]):
            c = f.get(k(x, y))
            if c == 'O':
                res += s[1] - y
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        print('Part 1', part1(lines))
        print('Part 2', part2(lines))


main()
