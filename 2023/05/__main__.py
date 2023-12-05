def process_mode(mode, seeds, seeds_dict, mappings):
    if not mode:
        return
    source, _, dest = mode
    for seed in seeds:
        source_value = seeds_dict.get(seed).get(source)
        found = False
        for dest_m, source_m, diff in mappings:
            dv = source_value - source_m
            if dv >= 0 and dv < diff:
                seeds_dict[seed][dest] = dv + dest_m
                found = True
        if not found:
            seeds_dict[seed][dest] = source_value


def part1(lines):
    _, seeds = lines[0].split(':')
    seeds = list(map(int, seeds.strip().split(' ')))

    seeds_dict = {}

    for seed in seeds:
        seeds_dict[seed] = { 'seed': seed }

    mode = None
    mappings = []

    for idx, line in enumerate(lines):
        if idx == 0:
            continue
        if not line:
            continue
        if line.endswith(':'):
            process_mode(mode, seeds, seeds_dict, mappings)
            mode, _ = line.split(' ')
            mode = mode.split('-')
            mappings = []
        else:
            mappings.append(list(map(int, line.split(' '))))
    process_mode(mode, seeds, seeds_dict, mappings)
    res = 999999999
    for seed in seeds:
        sd = seeds_dict.get(seed)
        res = min(res, sd.get('location'))
    return res


with open('./2023/05/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

    print('part 1', part1(lines))
