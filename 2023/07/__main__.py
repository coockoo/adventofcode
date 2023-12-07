from functools import cmp_to_key


def get_rank(hand):
    res = {}
    for i in hand[0]:
        if not res.get(i):
            res[i] = 0
        res[i] += 1
    vals = res.values()
    if (5 in vals):
        return 1
    if (4 in vals):
        return 2
    if (3 in vals and 2 in vals):
        return 3
    if (3 in vals):
        return 4
    if (list(vals).count(2) == 2):
        return 5
    if (2 in vals):
        return 6
    return 7


def get_value(card):
    return 'AKQJT98765432'.find(card)


def sort_fn(a, b):
    ra = get_rank(a)
    rb = get_rank(b)
    if ra == rb:
        for i in range(len(a[0])):
            if get_value(a[0][i]) > get_value(b[0][i]):
                return -1
            if get_value(a[0][i]) < get_value(b[0][i]):
                return 1
    return 1 if rb > ra else -1


def main():
    with open('./2023/07/input.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

        hands = []
        for line in lines:
            if not line:
                continue
            cur = line.split(' ')
            cur[1] = int(cur[1])
            hands.append(cur)

        hands = sorted(hands, key=cmp_to_key(sort_fn))

        res = 0
        for idx, hand in enumerate(hands):
            res += ((idx + 1) * hand[1])
        print('part 1', res)


main()
