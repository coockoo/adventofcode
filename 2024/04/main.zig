const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/04/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var map = std.ArrayList(u8).init(std.heap.page_allocator);
    defer map.deinit();
    var res_one: usize = 0;
    var res_two: usize = 0;
    var row_len: usize = 0;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        row_len = @max(row_len, line.len);
        for (line) |c| {
            try map.append(c);
        }
    }
    for (0..map.items.len) |idx| {
        res_one += check(map.items, idx, row_len);
        res_two += findX(map.items, idx, row_len);
    }
    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

// TODO: list and stuff to struct with methods/fields (WOW)
fn check(map: []const u8, idx: usize, row_len: usize) usize {
    var res: usize = 0;
    const y: usize = @divTrunc(idx, row_len);
    const x: usize = @rem(idx, row_len);
    const rows: usize = @divTrunc(map.len, row_len);
    if (x + 4 <= row_len) {
        const slice = makeSlice(map, idx, row_len, 1, 0);
        if (okSlice(&slice)) {
            res += 1;
        }
    }
    if (y + 4 <= rows) {
        const slice = makeSlice(map, idx, row_len, 0, 1);
        if (okSlice(&slice)) {
            res += 1;
        }
    }
    if (x + 4 <= row_len and y + 4 <= rows) {
        const slice = makeSlice(map, idx, row_len, 1, 1);
        if (okSlice(&slice)) {
            res += 1;
        }
    }
    if (x >= 4 - 1 and y + 4 <= rows) {
        const slice = makeSlice(map, idx, row_len, -1, 1);
        if (okSlice(&slice)) {
            res += 1;
        }
    }
    return res;
}

fn findX(map: []const u8, idx: usize, row_len: usize) usize {
    const y: usize = @divTrunc(idx, row_len);
    const x: usize = @rem(idx, row_len);
    const rows: usize = @divTrunc(map.len, row_len);
    if (y >= rows - 2 or x >= row_len - 2 or map[idx + row_len + 1] != 'A') {
        return 0;
    }
    const tl = map[idx];
    const tr = map[idx + 2];
    const bl = map[idx + 2 * row_len];
    const br = map[idx + 2 * row_len + 2];
    // zig fmt: off
    if (
           (tl == 'M' and tr == 'M' and bl == 'S' and br == 'S')
        or (tl == 'S' and tr == 'S' and bl == 'M' and br == 'M')
        or (tl == 'M' and tr == 'S' and bl == 'M' and br == 'S')
        or (tl == 'S' and tr == 'M' and bl == 'S' and br == 'M')
        // zig fmt: on
    ) {
        return 1;
    }
    return 0;
}

fn makeSlice(map: []const u8, idx: usize, row_len: usize, dx: isize, dy: usize) [4]u8 {
    var res: [4]u8 = undefined;
    @memset(&res, 0);
    inline for (0..4) |ui| {
        const i = @as(isize, @intCast(ui));
        const shifted_idx = @as(isize, @intCast(idx + row_len * ui * dy)) + i * dx;
        res[i] = map[@abs(shifted_idx)];
    }
    return res;
}

fn okSlice(slice: []const u8) bool {
    return std.mem.eql(u8, "XMAS", slice) or std.mem.eql(u8, "SAMX", slice);
}
