def step(current, counter, dirs, nodes):
    dir = dirs[counter % len(dirs)]
    cn = nodes.get(current)
    return cn[0] if dir == 'L' else cn[1]


def run(start: str, dirs, nodes):
    counter = 0
    current = start
    while True:
        if current == 'ZZZ':
            return counter
        current = step(current, counter, dirs, nodes)
        counter += 1


def run2(starts: str, dirs, nodes):
    counter = 0
    current = starts
    while True:
        print(counter)
        if all(t.endswith('Z') for t in current):
            return counter
        nc = []
        for i in current:
            nc.append(step(i, counter, dirs, nodes))
        current = nc
        counter += 1


def main():
    with open('./2023/08/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        dirs = lines[0]

        nodes = {}
        for line in lines[2:]:
            if not line:
                continue
            nodes[line[0:3]] = (line[7:10], line[12:15])

        starts = list(filter(lambda val: val.endswith('A'), nodes.keys()))
        res = run2(starts, dirs, nodes)
        print('part 2', res)


        # print('part 1', run('AAA', dirs, nodes))


main()
