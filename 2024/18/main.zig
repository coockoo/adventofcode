const std = @import("std");
const print = std.debug.print;
const Allocator = std.mem.Allocator;

const Pos = struct { score: usize, idx: usize, path: []const usize };

fn compare(w: usize, a: Pos, b: Pos) std.math.Order {
    const dx: isize = @as(isize, @intCast(w)) - 1;
    const dy: isize = @as(isize, @intCast(w)) - 1;

    const ay: isize = @intCast(@divTrunc(a.idx, w));
    const ax: isize = @intCast(@rem(a.idx, w));

    const by: isize = @intCast(@divTrunc(b.idx, w));
    const bx: isize = @intCast(@rem(b.idx, w));

    return std.math.order(a.score + @abs(dx - ax) + @abs(dy - ay), b.score + @abs(dx - bx) + @abs(dy - by));
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // const filename = "demo";
    // const w: usize = 7;
    // const max_bytes: usize = 12;
    const filename = "input";
    const w: usize = 71;
    const max_bytes: usize = 1024;

    const file = try std.fs.cwd().openFile("./2024/18/" ++ filename ++ ".txt", .{});
    defer file.close();
    var reader = file.reader();

    var map: [w * w]bool = undefined;
    @memset(&map, false);

    var addons = std.ArrayList(usize).init(allocator);
    defer addons.deinit();

    var i: usize = 0;
    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 16)) |line| : (i += 1) {
        var it = std.mem.splitScalar(u8, line, ',');
        const x = try std.fmt.parseInt(usize, it.next().?, 10);
        const y = try std.fmt.parseInt(usize, it.next().?, 10);
        const idx = y * w + x;
        if (i < max_bytes) {
            map[idx] = true;
        } else {
            try addons.append(idx);
        }
    }

    const res_one = try solve(allocator, &map, w);
    print("Part 1: {d}\n", .{res_one.?});

    var res_two: usize = undefined;
    for (addons.items) |idx| {
        map[idx] = true;
        const maybe_res = try solve(allocator, &map, w);
        if (maybe_res == null) {
            res_two = idx;
            break;
        }
    }
    const y: usize = @divTrunc(res_two, w);
    const x: usize = @rem(res_two, w);
    print("Part 2: {d},{d}\n", .{ x, y });
}

fn solve(parentAllocator: Allocator, map: []const bool, w: usize) !?usize {
    var arena = std.heap.ArenaAllocator.init(parentAllocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var q = std.PriorityQueue(Pos, usize, compare).init(allocator, w);
    defer q.deinit();
    try q.add(.{ .idx = 0, .score = 0, .path = undefined });

    var visited = std.AutoHashMap(usize, bool).init(allocator);
    defer visited.deinit();

    var res: ?usize = null;
    while (q.items.len > 0) {
        const pos = q.remove();
        if (visited.contains(pos.idx)) {
            continue;
        }
        if (pos.idx == w * w - 1) {
            res = pos.score;
            break;
        }
        try visited.put(pos.idx, true);
        const ms = moves(map, w, pos.idx);

        for (ms) |next_idx_maybe| {
            if (next_idx_maybe) |next_idx| {
                const path = try allocator.alloc(usize, pos.path.len + 1);
                @memcpy(path[0..pos.path.len], pos.path);
                path[pos.path.len] = pos.idx;
                if (!visited.contains(next_idx)) {
                    try q.add(.{ .idx = next_idx, .score = pos.score + 1, .path = path });
                }
            }
        }
    }
    return res;
}

fn moves(map: []const bool, w: usize, idx: usize) [4]?usize {
    var res: [4]?usize = undefined;
    for (ns(w, idx), 0..) |n_maybe, i| {
        res[i] = null;
        if (n_maybe) |n| {
            if (!map[n]) {
                res[i] = n;
            }
        }
    }
    return res;
}

fn ns(w: usize, idx: usize) [4]?usize {
    const y: usize = @divTrunc(idx, w);
    const x: usize = @rem(idx, w);
    return .{
        if (y > 0) (y - 1) * w + x else null,
        if (x < w - 1) y * w + x + 1 else null,
        if (y < w - 1) (y + 1) * w + x else null,
        if (x > 0) y * w + (x - 1) else null,
    };
}
