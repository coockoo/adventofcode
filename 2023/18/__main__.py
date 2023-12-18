from os import path


def k(x: int, y: int) -> str:
    return f'{x},{y}'


def get_neighbours(x: int, y: int, m: dict, v: dict, min_s: tuple[int, int], max_s: tuple[int, int]) -> str:
    ns = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
    return [
        i for i in ns if
        i[0] >= min_s[0]
        and i[1] >= min_s[1]
        and i[0] < max_s[0]
        and i[1] < max_s[1]
        and not m.get(k(*i))
        and not v.get(k(*i))
    ]


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        x = 0
        y = 0
        max_x = x
        max_y = y
        min_x = x
        min_y = y
        m = {k(x, y): '#'}
        for line in lines:
            dir, steps, *rest = line.split(' ')
            for i in range(int(steps)):
                if dir == 'L':
                    x -= 1
                    min_x = min(x, min_x)
                if dir == 'R':
                    x += 1
                    max_x = max(x, max_x)
                if dir == 'U':
                    y -= 1
                    min_y = min(y, min_y)
                if dir == 'D':
                    y += 1
                    max_y = max(y, max_y)
                m[k(x, y)] = '#'
        min_s = (min_x - 1, min_y - 1)
        max_s = (max_x + 2, max_y + 2)

        v = {k(*min_s): True}
        q = [min_s]
        while len(q):
            c = q.pop()
            ns = get_neighbours(*c, m, v, min_s, max_s)
            for n in ns:
                v[k(*n)] = True
                q.append(n)
        sq = (max_s[0] - min_s[0]) * (max_s[1] - min_s[1])
        print(sq - len(v))


main()
