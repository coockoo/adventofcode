const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa_allocator = gpa.allocator();
    var arena = std.heap.ArenaAllocator.init(gpa_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const file = try std.fs.cwd().openFile("./2024/08/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var res_one: usize = 0;
    var res_two: usize = 0;

    var row_len: usize = 0;
    var rows: usize = 0;

    var map = std.AutoHashMap(u8, std.ArrayList(usize)).init(allocator);
    defer map.deinit();
    var signals = std.AutoHashMap(usize, bool).init(allocator);
    defer signals.deinit();

    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
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

    var it = map.iterator();
    while (it.next()) |entry| {
        for (entry.value_ptr.items) |a| {
            for (entry.value_ptr.items) |b| {
                if (a == b) {
                    continue;
                }
                // for part 1 - comment
                try signals.put(a, true);
                try signals.put(b, true);

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
                    // for part 1
                    // break;
                }
            }
        }
    }

    res_one += 0;
    res_two += 0;
    std.debug.print("Part 1: {d}\n", .{signals.count()});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

fn toi(n: usize) isize {
    return @as(isize, @intCast(n));
}
