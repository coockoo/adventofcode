def get_key(x: int, y: int) -> str:
    return str(y) + ':' + str(x)


def neighbours(x, y):
    left = (x - 1, y)
    right = (x + 1, y)
    top = (x, y - 1)
    bot = (x, y + 1)
    return (left, right, top, bot)


def dirs(map, size: tuple[int, int], x: int, y: int) -> str:
    res = []
    v = map.get(get_key(x, y))
    left, right, top, bot = neighbours(x, y)
    if v == '7':
        res = [left, bot]
    if v == 'F':
        res = [right, bot]
    if v == 'J':
        res = [left, top]
    if v == 'L':
        res = [right, top]
    if v == '|':
        res = [bot, top]
    if v == '-':
        res = [left, right]

    return list(filter(lambda i: i[0] >= 0 and i[1] >= 0 and i[0] < size[0] and i[1] < size[1] and map.get(get_key(*i)) != '.', res))


def ray(map, poly, size: tuple[int, int], x: int, y: int) -> bool:
    if (x, y) in poly:
        return False

    count = 0
    fr = '.'
    for iy in range(0, y):
        p = (x, iy)
        v = map.get(get_key(*p))
        if not v or v == '|' or v == '.' or p not in poly:
            continue
        if v == '7' or v == 'F' or v == '-':
            fr = v
            count += 1
        if v == 'L' and fr == 'F':
            count -= 1
        if v == 'J' and fr == '7':
            count -= 1
    return count % 2 != 0


def main():
    with open('./2023/10/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        map = {}
        size = (len(lines[0]), len(lines) - 1)
        ranges = {}

        q = []
        for y, line in enumerate(lines):
            if not line:
                continue
            for x, c in enumerate(line):
                map[get_key(x, y)] = c
                if (c == 'S'):
                    q.append((x, y))
                    ranges[get_key(x, y)] = 0
                    # TODO: haha, manual work instead of bunch of ifs
                    map[get_key(x, y)] = 'F'

        poly = [q[0]]
        while len(q):
            current = q.pop()
            c_key = get_key(*current)
            for d in dirs(map, size, *current):
                d_key = get_key(*d)
                next = ranges.get(c_key) + 1
                if ranges.get(d_key) is not None and ranges.get(d_key) <= next:
                    continue
                ranges[d_key] = next
                q.append(d)
                poly.append(d)

        print('Part 1', max(ranges.values()))

        res = 0
        for x in range(0, size[0]):
            for y in range(0, size[1]):
                if ray(map, poly, size, x, y):
                    res += 1

        print('Part 2', res)


main()
