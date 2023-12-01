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


res = 0
with open('./2023/01/input.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')
    for line in lines:
        if not line:
            continue
        first = ''
        last = ''
        for i in range(len(line)):
            char = line[i]
            k = get_key(line[i:])
            print('key', k)
            if not first and k:
                first = nums[k]
            if not first and char >= '0' and char <= '9':
                first = char
            if char >= '0' and char <= '9':
                last = char
            if k:
                last = nums[k]
        res += int(first) * 10 + int(last)

print(res)
