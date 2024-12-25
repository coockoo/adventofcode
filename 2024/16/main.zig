const std = @import("std");
const Visited = std.AutoHashMap(usize, bool);
const print = std.debug.print;
const Allocator = std.mem.Allocator;

const Dir = enum { u, r, d, l };

const Pos = struct { score: usize, idx: usize, dir: Dir };

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

    var stack = std.PriorityQueue(Pos, void, compare).init(allocator, {});
    defer stack.deinit();

    var visited = std.AutoHashMap(usize, usize).init(allocator);
    defer visited.deinit();

    var end: usize = undefined;

    var w: usize = 0;
    var h: usize = 0;

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        try map.appendSlice(line);
        w = @max(line.len, w);
        const y = h * w;
        if (std.mem.indexOfScalar(u8, line, 'S')) |x| {
            try stack.add(.{ .idx = y + x, .dir = .r, .score = 0 });
        }
        if (std.mem.indexOfScalar(u8, line, 'E')) |x| {
            end = y + x;
        }
        h += 1;
    }

    var res_one: usize = std.math.maxInt(usize);
    while (stack.items.len > 0) {
        const pos = stack.remove();
        if (visited.get(pos.idx)) |visited_score| {
            if (visited_score < pos.score) {
                continue;
            }
        }
        if (pos.idx == end) {
            res_one = pos.score;
            break;
        }
        try visited.put(pos.idx, pos.score);
        const ms = moves(map.items, w, h, pos.idx);

        if (ms[0]) |mu| {
            const cost: usize = switch (pos.dir) {
                .u => 1,
                .r => 1001,
                .d => 2001,
                .l => 1001,
            };
            if (pos.dir != .d) try stack.add(.{ .score = pos.score + cost, .idx = mu, .dir = .u });
        }

        if (ms[1]) |mr| {
            const cost: usize = switch (pos.dir) {
                .u => 1001,
                .r => 1,
                .d => 1001,
                .l => 2001,
            };
            if (pos.dir != .l) try stack.add(.{ .score = pos.score + cost, .idx = mr, .dir = .r });
        }

        if (ms[2]) |md| {
            const cost: usize = switch (pos.dir) {
                .u => 2001,
                .r => 1001,
                .d => 1,
                .l => 1001,
            };
            if (pos.dir != .u) try stack.add(.{ .score = pos.score + cost, .idx = md, .dir = .d });
        }

        if (ms[3]) |ml| {
            const cost: usize = switch (pos.dir) {
                .u => 1001,
                .r => 2001,
                .d => 1001,
                .l => 1,
            };
            if (pos.dir != .r) try stack.add(.{ .score = pos.score + cost, .idx = ml, .dir = .l });
        }
    }

    print("Part 1: {d}\n", .{res_one});
    var res_two: usize = 0;
    res_two += 0;
    print("Part 2: {d}\n", .{res_two});
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

// fn isValid(map: []u8, idx: Pos) bool {
// return pos.y >= 0 and pos.y < grid.len and pos.x >= 0 and pos.x < grid.*[@abs(pos.y)].len;
// }
