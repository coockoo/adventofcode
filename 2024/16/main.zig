const std = @import("std");
const print = std.debug.print;
const Allocator = std.mem.Allocator;

const Dir = enum { u, r, d, l };

const Pos = struct { score: usize, idx: usize, dir: Dir, path: []const usize };
const Visited = struct { idx: usize, dir: Dir };

fn compare(ctx: void, a: Pos, b: Pos) std.math.Order {
    _ = ctx;
    return std.math.order(a.score, b.score);
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/16/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var map = std.ArrayList(u8).init(allocator);
    defer map.deinit();

    var q = std.PriorityQueue(Pos, void, compare).init(allocator, {});
    defer q.deinit();

    var visited = std.AutoHashMap(Visited, usize).init(allocator);
    defer visited.deinit();

    var end: usize = undefined;

    var w: usize = 0;
    var h: usize = 0;

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        try map.appendSlice(line);
        w = @max(line.len, w);
        const y = h * w;
        if (std.mem.indexOfScalar(u8, line, 'S')) |x| {
            try q.add(.{ .idx = y + x, .dir = .r, .score = 0, .path = undefined });
        }
        if (std.mem.indexOfScalar(u8, line, 'E')) |x| {
            end = y + x;
        }
        h += 1;
    }

    var paths = std.AutoHashMap(usize, bool).init(allocator);
    defer paths.deinit();
    try paths.put(end, true);

    var res_one: usize = std.math.maxInt(usize);
    while (q.items.len > 0) {
        const pos = q.remove();
        if (visited.get(.{ .idx = pos.idx, .dir = pos.dir })) |visited_score| {
            if (pos.score > visited_score) {
                continue;
            }
        }
        if (pos.idx == end) {
            if (pos.score > res_one) {
                break;
            }
            res_one = pos.score;
            for (pos.path) |i| {
                try paths.put(i, true);
            }
        }
        try visited.put(.{ .idx = pos.idx, .dir = pos.dir }, pos.score);
        const ms = moves(map.items, w, h, pos.idx);

        const path = try allocator.alloc(usize, pos.path.len + 1);
        @memcpy(path[0..pos.path.len], pos.path);
        path[pos.path.len] = pos.idx;
        // TODO: investigate how to free without segfault. How to debug segfault
        // defer allocator.free(pos.path);

        const dirs: [4]Dir = .{ .u, .r, .d, .l };
        for (ms, dirs) |next_idx_maybe, dir| {
            if (next_idx_maybe) |next_idx| {
                const cost: usize = if (pos.dir == dir) 1 else 1001;
                if (std.mem.indexOfScalar(usize, pos.path, next_idx) == null) {
                    try q.add(.{ .score = pos.score + cost, .idx = next_idx, .dir = dir, .path = path });
                }
            }
        }
    }

    print("Part 1: {d}\n", .{res_one});
    print("Part 2: {d}\n", .{paths.count()});
}

fn moves(map: []u8, w: usize, h: usize, idx: usize) [4]?usize {
    var res: [4]?usize = undefined;
    for (ns(w, h, idx), 0..) |n_maybe, i| {
        res[i] = null;
        if (n_maybe) |n| {
            if (map[n] == '.' or map[n] == 'E') {
                res[i] = n;
            }
        }
    }
    return res;
}

fn ns(w: usize, h: usize, idx: usize) [4]?usize {
    const y: usize = @divTrunc(idx, w);
    const x: usize = @rem(idx, h);
    return .{
        if (y > 0) (y - 1) * w + x else null,
        if (x < w - 1) y * w + x + 1 else null,
        if (y < h - 1) (y + 1) * w + x else null,
        if (x > 0) y * w + (x - 1) else null,
    };
}
