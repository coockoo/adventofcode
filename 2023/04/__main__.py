import re

with open('./2023/04/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

    res = 0
    mul = { 1: 1 }

    for idx, line in enumerate(lines):
        if not line:
            continue
        t, all = line.split(':')
        num = idx + 1
        wins, mys = all.split('|')
        win = list(map(int, filter(lambda i: i, wins.strip().split(' '))))
        my = list(map(int, filter(lambda i: i, mys.strip().split(' '))))

        count = 0
        for x in my:
            if x in win:
                count += 1
        if not mul.get(num):
            mul[num] = 1
        if count > 0:
            res += pow(2, count - 1)
            for i in range(count):
                if not mul.get(num + i + 1):
                    mul[num + i + 1] = 1
                mul[num + i + 1] += mul.get(num)

    print('part 1', res)
    print('part 2', sum(mul.values()))
