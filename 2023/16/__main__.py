from os import path


def k(x: int, y: int) -> str:
    return f'{x}:{y}'


def vk(x: int, y: int, d: str) -> str:
    return f'{x}:{y}:{d}'


def move(m: dict, p: tuple[int, int], dir: str) -> list[tuple[tuple[int, int], str]]:
    next = []
    c = m.get(k(*p))
    if dir == 'r' and (c == '\\' or c == '|'):
        next.append(((p[0], p[1] + 1), 'd'))
    if dir == 'r' and (c == '/' or c == '|'):
        next.append(((p[0], p[1] - 1), 'u'))
    if dir == 'l' and (c == '\\' or c == '|'):
        next.append(((p[0], p[1] - 1), 'u'))
    if dir == 'l' and (c == '/' or c == '|'):
        next.append(((p[0], p[1] + 1), 'd'))
    if dir == 'd' and (c == '\\' or c == '-'):
        next.append(((p[0] + 1, p[1]), 'r'))
    if dir == 'd' and (c == '/' or c == '-'):
        next.append(((p[0] - 1, p[1]), 'l'))
    if dir == 'u' and (c == '\\' or c == '-'):
        next.append(((p[0] - 1, p[1]), 'l'))
    if dir == 'u' and (c == '/' or c == '-'):
        next.append(((p[0] + 1, p[1]), 'r'))
    if dir == 'r' and (c == '.' or c == '-'):
        next.append(((p[0] + 1, p[1]), dir))
    if dir == 'l' and (c == '.' or c == '-'):
        next.append(((p[0] - 1, p[1]), dir))
    if dir == 'd' and (c == '.' or c == '|'):
        next.append(((p[0], p[1] + 1), dir))
    if dir == 'u' and (c == '.' or c == '|'):
        next.append(((p[0], p[1] - 1), dir))

    return list(i for i in next if m.get(k(*i[0])))


def solve(m, initial):
    v = {}
    r = {}
    st = [initial]
    while (len(st)):
        p, dir = st.pop()
        next = move(m, p, dir)
        # print(p, dir, m.get(k(*p)), '->', next)
        for i in next:
            if v.get(vk(*i[0], i[1])):
                continue
            else:
                st.append(i)
        v[vk(*p, dir)] = True
        r[k(*p)] = True

    return len(r.values())


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        m = {}

        for y, line in enumerate(lines):
            for x, c in enumerate(line):
                m[k(x, y)] = c

        print('Part 1', solve(m, ((0, 0), 'r')))

        mx = 0
        for y in range(len(lines)):
            mx = max(mx, solve(m, ((0, y), 'r')))
            mx = max(mx, solve(m, ((len(lines[0]) - 1, y), 'l')))
        for x in range(len(lines[0])):
            mx = max(mx, solve(m, ((x, 0), 'd')))
            mx = max(mx, solve(m, ((x, len(lines) - 1), 'u')))

        print('Part 2', mx)


main()
