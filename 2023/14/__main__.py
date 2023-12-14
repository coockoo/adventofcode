def transpose(rows: list[str]) -> list[str]:
    return [''.join([r[i] for r in rows]) for i in range(len(rows[0]))]


def main():
    with open('./2023/14/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        rows = []
        res = 0
        for line in lines:
            if not line:
                continue
            rows.append(line)

        cols = transpose(rows)

        for col in cols:
            w = len(col)
            for idx, c in enumerate(col):
                if c == 'O':
                    res += w
                    w -= 1
                if c == '#':
                    w = len(col) - idx - 1

        print('Part 1', res)


main()
