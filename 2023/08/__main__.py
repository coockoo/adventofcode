from math import lcm


def step(current, counter, dirs, nodes):
    dir = dirs[counter % len(dirs)]
    cn = nodes.get(current)
    return cn[0] if dir == 'L' else cn[1]


def run(start: str, dirs, nodes, check_fn):
    current = start
    counter = 0
    while True:
        if check_fn(current):
            return counter
        current = step(current, counter, dirs, nodes)
        counter += 1


def parse_nodes(lines: list[str]):
    nodes = {}
    for line in lines[2:]:
        if not line:
            continue
        nodes[line[0:3]] = (line[7:10], line[12:15])
    return nodes


def main():
    with open('./2023/08/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        dirs = lines[0]
        nodes = parse_nodes(lines)

        print('part 1', run('AAA', dirs, nodes, lambda c: c == 'ZZZ'))

        starts = list(filter(lambda val: val.endswith('A'), nodes.keys()))
        t = []
        for start in starts:
            t.append(run(start, dirs, nodes, lambda c: c.endswith('Z')))
        print('part 2', lcm(*t))


main()
