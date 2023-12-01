a = {}
a['kappa'] = 10
for i in range(10):
    a[i] = {}

nums = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'zero': 0,
}

keys = list(nums.keys())


def get_key(line: str) -> int:
    for key in keys:
        if (line.startswith(key)):
            return key


def solve(lines: list[str], part: int) -> str:
    res = 0
    for line in lines:
        if not line:
            continue
        first: int = None
        last: int = None
        for i in range(len(line)):
            char = line[i]
            if part == 2:
                key = get_key(line[i:])
                if key:
                    last = nums[key]
                    if first is None:
                        first = nums[key]
            if char >= '0' and char <= '9':
                last = char
                if first is None:
                    first = char
        res += int(first) * 10 + int(last)
    return res


with open('./2023/01/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')
    print('part 1', solve(lines, 1))
    print('part 2', solve(lines, 2))
