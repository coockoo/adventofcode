with open('./2023/04/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

    res = 0
    mul = {}

    for idx, line in enumerate(lines):
        if not line:
            continue
        t, all = line.split(':')
        wins, mys = all.split('|')
        win = list(filter(lambda i: i, wins.strip().split(' ')))
        my = list(filter(lambda i: i, mys.strip().split(' ')))

        count = 0
        for x in my:
            if x in win:
                count += 1
        if not mul.get(idx):
            mul[idx] = 1
        if count > 0:
            res += pow(2, count - 1)
            for i in range(idx + 1, idx + count + 1):
                if not mul.get(i):
                    mul[i] = 1
                mul[i] += mul.get(idx)

    print('part 1', res)
    print('part 2', sum(mul.values()))
