const std = @import("std");
const Map = std.AutoHashMap(u8, std.ArrayList(usize));
const Allocator = std.mem.Allocator;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var arena = std.heap.ArenaAllocator.init(gpa.allocator());
    defer arena.deinit();
    const allocator = arena.allocator();

    const file = try std.fs.cwd().openFile("./2024/08/input.txt", .{});
    defer file.close();

    var reader = file.reader();
    var row_len: usize = 0;
    var rows: usize = 0;
    var map = Map.init(allocator);
    defer map.deinit();
    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 64)) |line| {
        row_len = @max(row_len, line.len);
        for (line, 0..) |c, idx| {
            if (c == '.') {
                continue;
            }
            var list = map.get(c) orelse std.ArrayList(usize).init(allocator);
            _ = try list.append(rows * row_len + idx);
            try map.put(c, list);
        }
        rows += 1;
    }

    const res_one = try solve(allocator, map, row_len, rows, false);
    const res_two = try solve(allocator, map, row_len, rows, true);

    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

fn solve(allocator: Allocator, map: Map, row_len: usize, rows: usize, extended: bool) !usize {
    var signals = std.AutoHashMap(usize, bool).init(allocator);
    defer signals.deinit();

    var it = map.iterator();
    while (it.next()) |entry| {
        for (entry.value_ptr.items) |a| {
            for (entry.value_ptr.items) |b| {
                if (a == b) {
                    continue;
                }
                if (extended) {
                    try signals.put(a, true);
                    try signals.put(b, true);
                }

                const ax = toi(@rem(a, row_len));
                const ay = toi(@divTrunc(a, row_len));

                const bx = toi(@rem(b, row_len));
                const by = toi(@divTrunc(b, row_len));

                const dx: isize = ax - bx;
                const dy: isize = ay - by;

                var nax: isize = ax + dx;
                var nay: isize = ay + dy;

                while (nax >= 0 and nax < row_len and nay >= 0 and nay < rows) {
                    const ni = nay * toi(row_len) + nax;
                    try signals.put(@abs(ni), true);
                    nax += dx;
                    nay += dy;
                    if (!extended) {
                        break;
                    }
                }
            }
        }
    }
    return signals.count();
}

fn toi(n: usize) isize {
    return @as(isize, @intCast(n));
}
