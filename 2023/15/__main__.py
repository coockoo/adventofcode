from os import path


def hash(s: str) -> int:
    res = 0
    for c in s:
        res += ord(c)
        res *= 17
        res %= 256
    return res


def main():
    inp = path.join(path.dirname(__file__), 'input.txt')
    with open(inp, 'r', encoding='utf-8') as f:
        content = f.read()
        cmds = content.split('\n')[0].split(',')

        res = sum(hash(cmd) for cmd in cmds)
        print(res)



main()
