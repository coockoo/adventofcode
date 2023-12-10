def get_key(x: int, y: int) -> str:
    return str(y) + ':' + str(x)


def dirs(map, size: int, x: int, y: int) -> str:
    res = []
    v = map.get(get_key(x, y))
    left = (x-1, y)
    right = (x + 1, y)
    top = (x, y - 1)
    bot = (x, y + 1)
    if v == 'S':
        lv = map.get(get_key(*left))
        if lv == 'F' or lv == 'L' or lv == '-':
            res.append(left)
        rv = map.get(get_key(*right))
        if rv == 'J' or rv == '7' or rv == '-':
            res.append(right)
        tv = map.get(get_key(*top))
        if tv == '7' or rv == 'F' or tv == '|':
            res.append(top)
        bv = map.get(get_key(*bot))
        if bv == 'J' or bv == 'L' or bv == '|':
            res.append(bot)
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

    return list(filter(lambda i: i[0] >= 0 and i[1] >= 0 and i[0] < size and i[1] < size and map.get(get_key(*i)) != '.', res))


def main():
    with open('./2023/10/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        map = {}
        size = len(lines[0])
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

        print('Part 1', max(ranges.values()))


main()
