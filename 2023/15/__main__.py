from os import path
import re


def hash(s: str) -> int:
    res = 0
    for c in s:
        res += ord(c)
        res *= 17
        res %= 256
    return res


def part1(cmds: list[str]) -> int:
    return sum(hash(cmd) for cmd in cmds)


def part2(cmds: list[str]) -> int:
    boxes = {}
    for cmd in cmds:
        label = re.match(r'^\w+', cmd)[0]
        box = hash(label)

        if not boxes.get(box):
            boxes[box] = []

        if '-' in cmd:
            boxes[box] = [i for i in boxes.get(box) if i[0] != label]
        if '=' in cmd:
            fl = int(cmd.split('=')[1])
            found = False
            for idx, i in enumerate(boxes.get(box)):
                if i[0] == label:
                    found = True
                    boxes.get(box)[idx] = (label, fl)
                    break
            if not found:
                boxes[box].append((label, fl))

    res = 0
    for k, v in boxes.items():
        for idx, i in enumerate(v):
            _, fl = i
            res += (idx + 1) * fl * (k + 1)
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        cmds = content.split('\n')[0].split(',')

        print('Part 1', part1(cmds))
        print('Part 2', part2(cmds))


main()
