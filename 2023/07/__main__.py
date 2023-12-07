from functools import cmp_to_key


def get_rank_in_vals(vals):
    if 5 in vals:
        return 1
    if 4 in vals:
        return 2
    if 3 in vals and 2 in vals:
        return 3
    if 3 in vals:
        return 4
    if vals.count(2) == 2:
        return 5
    if 2 in vals:
        return 6
    return 7


def get_rank(hand):
    res = {}
    for i in hand[0]:
        if not res.get(i):
            res[i] = 0
        res[i] += 1
    vals = list(res.values())

    return get_rank_in_vals(vals)


def get_rank_2(hand):
    res = {}
    for i in hand[0]:
        if not res.get(i):
            res[i] = 0
        res[i] += 1
    js = res.pop('J') if res.get('J') else 0
    vals = list(res.values())

    if not len(vals):
        vals = [5]
    else:
        maxval = max(vals)
        if js:
            vals[vals.index(maxval)] += js

    return get_rank_in_vals(vals)


def get_value(card):
    return 'AKQJT98765432'.find(card)


def get_value_2(card):
    return 'AKQT98765432J'.find(card)


def sort_fn(a, b, rank_fn, value_fn):
    ra = rank_fn(a)
    rb = rank_fn(b)
    if ra == rb:
        for i in range(len(a[0])):
            va = value_fn(a[0][i])
            vb = value_fn(b[0][i])
            if va > vb:
                return -1
            if va < vb:
                return 1
    return rb - ra


def solve(hands, rank_fn, value_fn):
    hands = sorted(hands, key=cmp_to_key(lambda a, b: sort_fn(a, b, rank_fn, value_fn)))
    res = 0
    for idx, hand in enumerate(hands):
        res += ((idx + 1) * hand[1])
    return res


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

        print('part 1', solve(hands, get_rank, get_value))
        print('part 2', solve(hands, get_rank_2, get_value_2))


main()
