def parse_one_number(line: str) -> list[int]:
    return [int(''.join(list(filter(lambda i: i, line.split(':')[1].split(' ')))))]


def parse_mul_numbers(line: str) -> list[int]:
    return list(map(int, filter(lambda i: i, line.split(':')[1].split(' '))))


def solve(ts: list[int], ds: list[int]) -> int:
    res = 1
    for i, t in enumerate(ts):
        d = ds[i]
        c = 0
        for j in range(t):
            if j * (t - j) > d:
                c += 1
        res *= c
    return res


def main():
    with open('./2023/06/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        time, distance = content.split('\n')[0:2]

        print('part 1', solve(parse_mul_numbers(time), parse_mul_numbers(distance)))
        print('part 2', solve(parse_one_number(time), parse_one_number(distance)))


main()
