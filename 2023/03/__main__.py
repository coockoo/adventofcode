def has_symbol(field, row, col) -> bool:
    for drow in range(-1, 2):
        for dcol in range(-1, 2):
            ds = field.get(row + drow)
            if not ds:
                continue
            cs = ds.get(col + dcol)
            if not cs:
                continue
            if cs != '.' and not cs.isnumeric():
                return True
    return False


def collect_numbers(line: str):
    res = []
    current = []

    for col, char in enumerate(line):
        if char.isnumeric():
            current.append(char)
        elif len(current):
            res.append((''.join(current), col - len(current)))
            current = []
    if len(current):
        res.append((''.join(current), col - len(current) + 1))
        current = []

    return res


def part1(field, tuples):
    res = 0

    for num, row, col in tuples:
        t = 0
        for dc in range(col, col + len(num)):
            if has_symbol(field, row, dc):
                break
            t += 1
        if t != len(num):
            res += int(num)

    return res

def part2(lines, field, tuples):
    res = 0
    for row, line in enumerate(lines):
        for col, char in enumerate(line):
            if (char == '*'):
                nums = []
                for drow in range(-1, 2):
                    for dcol in range(-1, 2):
                        ds = field.get(row + drow)
                        if not ds:
                            continue
                        cs = ds.get(col + dcol)
                        if not cs:
                            continue
                        if cs.isnumeric():
                            for num, tr, tc in tuples:
                                if tr == row + drow and tc <= col + dcol and col + dcol <= tc + len(num) and (num, tr, tc) not in nums:
                                    nums.append((num, tr, tc))
                if (len(nums) == 2):
                    res += int(nums[0][0]) * int(nums[1][0])
    return res


with open('./2023/03/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

    field = {}

    # fill field with values
    for row, line in enumerate(lines):
        field[row] = {}
        for col, char in enumerate(line):
            field[row][col] = char

    tuples = []
    for row, line in enumerate(lines):
        nums = collect_numbers(line)
        for i in nums:
            tuples.append((i[0], row, i[1]))

    print('part 1', part1(field, tuples))
    print('part 2', part2(lines, field, tuples))
