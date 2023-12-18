from os import path


def parse1(lines: list[str]) -> tuple[list[tuple[int, int]], int]:
    points = []
    x = 0
    y = 0
    p = 0
    for line in lines:
        dir, steps, *rest = line.split(' ')
        steps = int(steps)
        p += steps
        if dir == 'L':
            x -= steps
        if dir == 'R':
            x += steps
        if dir == 'U':
            y -= steps
        if dir == 'D':
            y += steps
        points.append((x, y))
    return points, p


def parse2(lines: list[str]) -> tuple[list[tuple[int, int]], int]:
    points = []
    x = 0
    y = 0
    p = 0
    for line in lines:
        _, hex = line.split('#')
        steps = int(hex[:-2], 16)
        dir = hex[-2]
        p += steps
        if dir == '0':
            x += steps
        if dir == '1':
            y += steps
        if dir == '2':
            x -= steps
        if dir == '3':
            y -= steps
        points.append((x, y))
    return points, p


def solve(points: list[tuple[int, int]], p: int) -> int:
    s = 0
    lp = len(points)
    for idx in range(lp):
        ci = idx % lp
        ni = (idx + 1) % lp
        s += points[ci][0] * points[ni][1] - points[ci][1] * points[ni][0]
    return int((abs(s) + p) / 2) + 1


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        print('Part 1', solve(*parse1(lines)))
        print('Part 2', solve(*parse2(lines)))


main()
