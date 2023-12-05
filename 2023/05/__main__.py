with open('./2023/05/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

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
            if mode:
                s = mode[0]
                d = mode[2]
                for seed in seeds:
                    sd = seeds_dict.get(seed)
                    sv = sd.get(s)
                    found = False
                    for mapping in mappings:
                        dv = sv - mapping[1]
                        if dv >= 0 and dv < mapping[2]:
                            seeds_dict[seed][d] = dv + mapping[0]
                            found = True
                    if not found:
                        seeds_dict[seed][d] = sv
            mode, _ = line.split(' ')
            mode = mode.split('-')
            mappings = []
        else:
            mappings.append(list(map(int, line.split(' '))))
    if mode:
        s = mode[0]
        d = mode[2]
        for seed in seeds:
            sd = seeds_dict.get(seed)
            sv = sd.get(s)
            found = False
            for mapping in mappings:
                dv = sv - mapping[1]
                if dv >= 0 and dv < mapping[2]:
                    seeds_dict[seed][d] = dv + mapping[0]
                    found = True
            if not found:
                seeds_dict[seed][d] = sv
    res = 999999999 
    for seed in seeds:
        sd = seeds_dict.get(seed)
        res = min(res, sd.get('location'))

    print('part 1', res)
