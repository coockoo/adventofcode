import math

MAX = {
    'red': 12,
    'green': 13,
    'blue': 14
}

with open('./2023/02/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')
    res = 0

    gpower = 0

    for line in lines:
        if not line:
            continue
        title, rest = line.split(':', 1)
        idx = int(title.split(' ')[1])
        subsets = rest.split(';')

        lpos = 0

        counts = {}

        for sub in subsets:
            sub = sub.strip()
            groups = sub.split(',')
            subpossibles = 0
            for group in groups:
                group = group.strip()
                count, color = group.split(' ')
                if (counts.get(color) is None):
                    counts[color] = int(count)
                if (MAX[color] >= int(count)):
                    subpossibles += 1
                counts[color] = max(counts.get(color), int(count))
            if subpossibles == len(groups):
                lpos += 1
        gpower += math.prod(counts.values())
        if lpos == len(subsets):
            res += idx
    print('part 1', res)
    print('part 2', gpower)
