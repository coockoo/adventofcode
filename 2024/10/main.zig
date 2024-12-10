const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/10/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var rows = ArrayList([]usize).init(allocator);
    defer rows.deinit();

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 60)) |line| {
        const row = try allocator.alloc(usize, line.len);
        for (line, 0..) |c, i| {
            row[i] = std.fmt.parseInt(usize, &[_]u8{c}, 10) catch 10;
        }
        try rows.append(row);
    }

    var res_one: usize = 0;
    var res_two: usize = 0;

    for (rows.items, 0..) |row, y| {
        for (row, 0..) |value, x| {
            if (value == 0) {
                const t_res = try traverse(allocator, rows.items, y, x);
                res_one += t_res.score;
                res_two += t_res.d_score;
            }
        }
    }

    print("Part 1: {d}\n", .{res_one});
    print("Part 2: {d}\n", .{res_two});
}

const Point = struct {
    x: usize,
    y: usize,
};

const Res = struct {
    score: usize,
    d_score: usize,
};

fn traverse(allocator: Allocator, rows: [][]usize, start_y: usize, start_x: usize) !Res {
    var q = ArrayList(Point).init(allocator);
    defer q.deinit();

    var res = std.AutoHashMap(usize, usize).init(allocator);
    defer res.deinit();

    try q.append(.{ .x = start_x, .y = start_y });
    while (q.items.len > 0) {
        const current = q.pop();
        const x = current.x;
        const y = current.y;
        const current_val = rows[y][x];
        if (current_val == 9) {
            const key = y * rows[y].len + x;
            try res.put(key, (res.get(key) orelse 0) + 1);
            continue;
        }
        if (y > 0 and rows[y - 1][x] == current_val + 1) {
            try q.append(.{ .x = x, .y = y - 1 });
        }
        if (y < rows.len - 1 and rows[y + 1][x] == current_val + 1) {
            try q.append(.{ .x = x, .y = y + 1 });
        }
        if (x > 0 and rows[y][x - 1] == current_val + 1) {
            try q.append(.{ .x = x - 1, .y = y });
        }
        if (x < rows[y].len - 1 and rows[y][x + 1] == current_val + 1) {
            try q.append(.{ .x = x + 1, .y = y });
        }
    }

    var d_score: usize = 0;
    var it = res.valueIterator();
    while (it.next()) |value| {
        d_score += value.*;
    }

    return .{ .score = res.count(), .d_score = d_score };
}
