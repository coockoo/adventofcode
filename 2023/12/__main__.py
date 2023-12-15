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
    res = 0

    key = f'{pattern}:{",".join(str(p) for p in positions)}'
    if cache.get(key) is not None:
        return cache.get(key)

    if not len(positions):
        if '#' in pattern:
            cache[key] = 0
            return 0
        cache[key] = 1
        return 1
    if not len(pattern):
        cache[key] = 0
        return 0
    if sum(positions) + len(positions) - 1 > len(pattern):
        cache[key] = 0
        return 0

    if is_cool(pattern, positions[0]):
        deepres = solve(trim(pattern[positions[0] + 1:]), positions[1:], cache, depth + 1)
        res += deepres
    if (pattern.startswith('?')):
        deepres = solve(trim(pattern[1:]), positions, cache, depth + 1)
        res += deepres

    cache[key] = res
    return res


def solve_lines(lines: list[str], times: int) -> int:
    res = 0
    for line in lines:
        pattern, positions = line.split(' ')
        pattern = '?'.join([pattern] * times)
        pattern = trim(pattern)
        positions = [int(i) for i in positions.split(',')] * times
        res += solve(pattern, positions)
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = list(line for line in content.split('\n') if line)

        print('Part 1', solve_lines(lines, 1))
        print('Part 2', solve_lines(lines, 5))


main()
