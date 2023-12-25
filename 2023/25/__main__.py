from os import path

# import networkx as nx
# import matplotlib.pyplot as plt


def count_v(edges: list[tuple[str, str]], start: str) -> int:
    v = {}
    q = [start]
    while len(q):
        c = q.pop()
        for f, t in edges:
            if f == c and not v.get(t):
                v[t] = True
                q.append(t)
            if t == c and not v.get(f):
                v[f] = True
                q.append(f)
    return len(v)


def main():
    inp = path.join(path.dirname(__file__), "input.txt")
    with open(inp, "r", encoding="utf-8") as f:
        content = f.read()
        lines = list(line for line in content.split("\n") if line)

        edges = set()
        for line in lines:
            f, b = line.split(": ")
            for t in b.split(" "):
                edges.add((f, t))

        # TODO: this implementation requies drawing graph
        # and then removing edges manually
        # Proper way would be to use some kind of min-cut algorithm
        # TODO: understand and implement this algorithm
        """
        G = nx.Graph()
        for e in list(edges):
            G.add_edge(*e)
        nx.draw_networkx(G)
        ax = plt.gca()
        ax.margins(0.20)
        plt.axis("off")
        plt.show()
        """

        to_discard = [("gsk", "ncg"), ("rjs", "mrd"), ("ntx", "gmr")]
        for a, b in to_discard:
            edges.discard((a, b))
            edges.discard((b, a))

        edges = list(edges)
        print("Part 1", count_v(edges, "vvk") * count_v(edges, "dtm"))
        print("Part 2", "Merry Christmas! That was a great advent!")


main()
