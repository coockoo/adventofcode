from os import path


def transpose(rows: list[str]) -> list[str]:
    return [''.join([r[i] for r in rows]) for i in range(len(rows[0]))]


def part1(rows: list[str]) -> int:
    res = 0
    cols = transpose(rows)
    for col in cols:
        w = len(col)
        for idx, c in enumerate(col):
            if c == 'O':
                res += w
                w -= 1
            if c == '#':
                w = len(col) - idx - 1
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        print('Part 1', part1(list(line for line in lines if line)))


main()
