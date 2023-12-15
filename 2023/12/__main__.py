import re
from os import path


def is_cool(pattern: str, len: int) -> bool:
    my_re = rf'^[#\?]{{{len}}}([^#]|$)'
    return re.match(my_re, pattern) is not None


def trim(pattern: str) -> str:
    qidx = pattern.index('?') if '?' in pattern else None
    hidx = pattern.index('#') if '#' in pattern else None
    if qidx is None and hidx is None:
        return ''
    m = qidx if hidx is None else hidx if qidx is None else min(qidx, hidx)
    if not m:
        return pattern
    return pattern[m:]


def solve(pattern: str, positions: list[int], cache={}, depth: int = 0) -> int:
    # pad = ''.join(' ' for i in range(depth))
    # print(pad, 'calculating', f'"{pattern}"', positions)
    res = 0

    key = f'{pattern}:{",".join(str(p) for p in positions)}'
    if cache.get(key):
        # print('cache hit', key)
        return cache.get(key)

    if not len(positions):
        if '#' in pattern:
            # print(pad, 'no positions and hash')
            return 0
        # print(pad, 'no positions no hash')
        return 1
    if not len(pattern):
        # print(pad, 'empty pattern')
        return 0

    if is_cool(pattern, positions[0]):
        # print(pad, 'start cool', pattern, positions[0])
        deepres = solve(trim(pattern[positions[0] + 1:]), positions[1:], cache, depth + 1)
        # print(pad, 'solved cool', deepres)
        res += deepres
    if (pattern.startswith('?')):
        # print(pad, 'start questionmark', pattern, positions[0])
        deepres = solve(trim(pattern[1:]), positions, cache, depth + 1)
        # print(pad, 'solved questionmark', deepres)
        res += deepres

    cache[key] = res
    # print(pad, 'solved', res)
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        times = 1
        res = 0
        for idx, line in enumerate(lines):
            # print(idx + 1, 'of', len(lines))
            pattern, positions = line.split(' ')
            pattern = '?'.join([pattern] * times)
            pattern = trim(pattern)
            positions = [int(i) for i in positions.split(',')] * times
            res += solve(pattern, positions)

            # print(pattern, positions, solve(pattern, positions))

        print('Part 1', res)


main()
