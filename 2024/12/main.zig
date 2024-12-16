const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const AutoHashMap = std.AutoHashMap;
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/12/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var rows = ArrayList([]u8).init(allocator);
    defer rows.deinit();

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        try rows.append(line);
    }

    var visited = AutoHashMap(usize, bool).init(allocator);
    defer visited.deinit();

    var res_one: usize = 0;
    var res_two: usize = 0;

    for (0..rows.items.len) |y| {
        for (0..rows.items[y].len) |x| {
            const idx = rows.items[y].len * y + x;
            if (visited.get(idx) != null) {
                continue;
            }
            const process_res = try process(allocator, &rows, &visited, idx);
            res_one += process_res.perimeter * process_res.area;
            res_two += process_res.angles * process_res.area;
        }
    }

    print("Part 1: {d}\n", .{res_one});
    print("Part 2: {d}\n", .{res_two});
}

const ProcessRes = struct {
    angles: usize,
    area: usize,
    perimeter: usize,

    fn zero() ProcessRes {
        return ProcessRes{ .angles = 0, .area = 0, .perimeter = 0 };
    }
};

fn process(allocator: Allocator, rows: *ArrayList([]u8), visited: *AutoHashMap(usize, bool), start_idx: usize) !ProcessRes {
    var area: usize = 0;
    var perimeter: usize = 0;
    var angles: usize = 0;

    var q = ArrayList(usize).init(allocator);
    defer q.deinit();

    var land = AutoHashMap(usize, bool).init(allocator);
    defer land.deinit();

    try q.append(start_idx);
    const row_len = rows.items[0].len;

    while (q.items.len > 0) {
        const idx = q.pop();
        if (visited.contains(idx)) {
            continue;
        }
        const x = idx % row_len;
        const y = @divFloor(idx, row_len);
        const val = rows.items[y][x];

        try visited.put(idx, true);
        try land.put(idx, true);
        area += 1;

        const t = getN(rows, y, -1, x, 0) catch .{ 0, '.' };
        if (t[1] == val) {
            try q.append(t[0]);
        } else {
            perimeter += 1;
        }

        const b = getN(rows, y, 1, x, 0) catch .{ 0, '.' };
        if (b[1] == val) {
            try q.append(b[0]);
        } else {
            perimeter += 1;
        }

        const l = getN(rows, y, 0, x, -1) catch .{ 0, '.' };
        if (l[1] == val) {
            try q.append(l[0]);
        } else {
            perimeter += 1;
        }

        const r = getN(rows, y, 0, x, 1) catch .{ 0, '.' };
        if (r[1] == val) {
            try q.append(r[0]);
        } else {
            perimeter += 1;
        }
    }

    var it = land.keyIterator();
    while (it.next()) |idx_ptr| {
        const idx = idx_ptr.*;
        const x = idx % row_len;
        const y = @divFloor(idx, row_len);

        const t = getN(rows, y, -1, x, 0) catch .{ 9999, '.' };
        const b = getN(rows, y, 1, x, 0) catch .{ 9999, '.' };
        const l = getN(rows, y, 0, x, -1) catch .{ 9999, '.' };
        const r = getN(rows, y, 0, x, 1) catch .{ 9999, '.' };

        const tl = getN(rows, y, -1, x, -1) catch .{ 9999, '.' };
        if (cond(&land, tl[0], t[0], l[0])) {
            angles += 1;
        }

        const tr = getN(rows, y, -1, x, 1) catch .{ 9999, '.' };
        if (cond(&land, tr[0], t[0], r[0])) {
            angles += 1;
        }

        const bl = getN(rows, y, 1, x, -1) catch .{ 9999, '.' };
        if (cond(&land, bl[0], b[0], l[0])) {
            angles += 1;
        }

        const br = getN(rows, y, 1, x, 1) catch .{ 9999, '.' };
        if (cond(&land, br[0], b[0], r[0])) {
            angles += 1;
        }
    }

    return ProcessRes{ .area = area, .perimeter = perimeter, .angles = angles };
}

fn cond(land: *AutoHashMap(usize, bool), c: usize, a: usize, b: usize) bool {
    return (!land.contains(a) and !land.contains(b)) or (!land.contains(c) and land.contains(a) and land.contains(b));
}

fn getN(rows: *ArrayList([]u8), y: usize, dy: comptime_int, x: usize, dx: comptime_int) !struct { usize, u8 } {
    const ny = try if (dy < 0) std.math.sub(usize, y, @abs(dy)) else std.math.add(usize, y, dy);
    const nx = try if (dx < 0) std.math.sub(usize, x, @abs(dx)) else std.math.add(usize, x, dx);
    if (ny >= rows.items.len) return error.OutOfBounds;
    if (nx >= rows.items[ny].len) return error.OutOfBounds;
    const nval = rows.items[ny][nx];
    const nidx = ny * rows.items[ny].len + nx;
    return .{ nidx, nval };
}
