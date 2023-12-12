def match(pattern: str, positions: list[int]) -> bool:
    return list(map(lambda i: len(i), filter(lambda i: i, pattern.split('.')))) == positions


def generate(i, p):
    return bin(i).split('b')[1].zfill(p).replace('1', '#').replace('0', '.')


def replace(raw, repl: str):
    repl = [*reversed(repl)]
    res = ''
    for i in raw:
        if i == '?':
            res += repl.pop()
        else:
            res += i
    return res


def main():
    with open('./2023/12/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        res = 0
        for line in lines:
            if not line:
                continue
            raw_pattern, positions = line.split(' ')
            positions = [int(i) for i in positions.split(',')]
            p = raw_pattern.count('?')
            for i in range(pow(2, p)):
                replacements = generate(i, p)
                t = replace(raw_pattern, replacements)
                if match(t, positions):
                    res += 1

        print('part 1', res)

main()
