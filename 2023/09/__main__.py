def all_zero(lst: list[int]) -> bool:
    return all(i == 0 for i in lst)


# x - last = diff => x = diff + last
def extrapolate_last(row: list[int], diff: int) -> int:
    return row[-1] + diff


# first - x = diff => x = first - diff
def extrapolate_first(row: list[int], diff: int) -> int:
    return row[0] - diff


def solve(lines: list[str], extrapolate) -> int:
    res = 0
    for line in lines:
        if not line:
            continue

        rows = []
        nums = [int(i) for i in line.split(' ')]
        while not all_zero(nums):
            rows.append(nums)
            next = []
            for idx in range(len(nums) - 1):
                next.append(nums[idx + 1] - nums[idx])
            nums = next
        rows.reverse()

        val = 0
        for row in rows:
            val = extrapolate(row, val)
        res += val
    return res


def main():
    with open('./2023/09/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        print('part 1', solve(lines, extrapolate_last))
        print('part 2', solve(lines, extrapolate_first))


main()
