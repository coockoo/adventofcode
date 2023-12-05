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
        seeds_dict[seed] = {'seed': seed}

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


def part2(lines: list[str]):
    _, seeds = lines[0].split(':')
    seeds = list(map(int, seeds.strip().split(' ')))

    new_seeds = []
    current = None
    for idx, seed in enumerate(seeds):
        if idx % 2 == 0:
            current = seed
        else:
            new_seeds.append([current, current + seed - 1])
    seeds = new_seeds

    seeds_dict = {'seed': seeds}

    mode = None
    mappings = []

    for idx, line in enumerate(lines):
        if idx == 0:
            continue
        if not line:
            continue
        if line.endswith(':'):
            process_mode_2(mode, seeds_dict, mappings)
            mode, _ = line.split(' ')
            mode = mode.split('-')
            mappings = []
        else:
            mappings.append(list(map(int, line.split(' '))))
    process_mode_2(mode, seeds_dict, mappings)

    res = 999999999
    for first, _ in seeds_dict.get('location'):
        if first:
            res = min(first, res)
    return res


def process_mode_2(mode, seeds_dict, mappings):
    if not mode:
        return
    source, _, dest = mode
    print(source, '->', dest)

    new_values = []
    ranges = seeds_dict.get(source)
    # print('r', ranges)
    while len(ranges):
        print(source, dest, len(ranges))
        source_range = ranges.pop()
        found = False
        for mapping in mappings:
            m_res, unmapped = do_mapping(source_range, mapping)
            # print('mapping result', m_res, unmapped)
            if len(m_res):
                new_values.append(m_res)
                found = True
            for i in unmapped:
                ranges.append(i)
        if not found:
            new_values.append(source_range)
            # print('not found', source_range)

    seeds_dict[dest] = new_values
    # print('new values', dest, seeds_dict[dest])


def do_mapping(source_range, mapping):
    dest, source, r = mapping
    diff = dest - source
    source_m = [source, source + r - 1]

    # print('mapping', source_range, source_m, diff)

    ms = max(source_range[0], source_m[0])
    me = min(source_range[1], source_m[1])
    if ms < me:
        unmapped = []
        if source_range[0] < ms:
            unmapped.append([source_range[0], ms - 1])
        if me < source_range[1]:
            unmapped.append([me + 1, source_range[1]])
        return [ms + diff, me + diff], unmapped

    return [], []


def main():
    with open('./2023/05/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        print('part 1', part1(lines))
        print('part 2', part2(lines))


main()
