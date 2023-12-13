def transpose(rows: list[str]) -> list[str]:
    return [''.join([r[i] for r in rows]) for i in range(len(rows[0]))]


def diff_count(a: str, b: str) -> bool:
    return sum(1 if a[i] != b[i] else 0 for i in range(len(a)))


def lists_eq(a: list[str], b: list[str], accuracy: int) -> bool:
    s = sum(diff_count(a[i], b[i]) for i in range(min(len(a), len(b))))
    return s == accuracy


def get_reflection(rows: list[str], accuracy: int) -> int:
    for idx in range(1, len(rows)):
        if lists_eq(list(reversed(rows[0:idx])), rows[idx:], accuracy):
            return idx
    return 0


def solve(lines: list[str], accuracy: int) -> int:
    rows = []
    res = 0
    for line in lines:
        if not line:
            res += 100 * get_reflection(rows, accuracy)
            res += get_reflection(transpose(rows), accuracy)
            rows.clear()
        else:
            rows.append(line)
    return res


def main():
    with open('./2023/13/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        print('Part 1', solve(lines, 0))
        print('Part 2', solve(lines, 1))


main()
