const std = @import("std");

const Dir = enum { u, d, l, r };
const Dest = enum { exit, loop, move };

const Field = struct {
    items: []const u8,
    row_len: usize,
    pos: usize,
    dir: Dir,
    visited: std.AutoHashMap(usize, Dir),

    fn getX(self: *Field) usize {
        return @rem(self.pos, self.row_len);
    }

    fn getY(self: *Field) usize {
        return @divTrunc(self.pos, self.row_len);
    }

    fn resOne(self: *Field) usize {
        return self.visited.count();
    }

    // returns true if exited
    fn move(self: *Field) !Dest {
        const y = self.getY();
        const x = self.getX();
        const rows: usize = @divTrunc(self.items.len, self.row_len);

        const prev_dir = self.visited.get(self.pos);
        if (prev_dir == self.dir) {
            return .loop;
        }

        try self.visited.put(self.pos, prev_dir orelse self.dir);

        if (
        // zig fmt: off
               (self.dir == .r and x == self.row_len - 1)
            or (self.dir == .l and x == 0)
            or (self.dir == .u and y == 0)
            or (self.dir == .d and y == rows - 1)
        // zig fmt: on
        ) {
            return .exit;
        }

        const next_pos = switch (self.dir) {
            .r => self.pos + 1,
            .l => self.pos - 1,
            .u => self.pos - self.row_len,
            .d => self.pos + self.row_len,
        };

        if (self.items[next_pos] == '#') {
            self.dir = switch (self.dir) {
                .u => .r,
                .r => .d,
                .d => .l,
                .l => .u,
            };
        } else {
            self.pos = next_pos;
        }

        return .move;
    }

    fn init(items: []const u8, row_len: usize, pos: usize) Field {
        const visited = std.AutoHashMap(usize, Dir).init(std.heap.page_allocator);
        return .{
            .items = items,
            .row_len = row_len,
            .pos = pos,
            .dir = .u,
            .visited = visited,
        };
    }

    fn deinit(self: *Field) void {
        self.visited.deinit();
    }
};

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/06/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;

    var map = std.ArrayList(u8).init(std.heap.page_allocator);
    defer map.deinit();
    var res_two: usize = 0;
    var row_len: usize = 0;
    var pos: usize = 0;
    var read_idx: usize = 0;

    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        row_len = @max(row_len, line.len);
        for (line) |c| {
            if (c == '^') {
                pos = read_idx;
            }
            try map.append(c);
            read_idx += 1;
        }
    }

    var field = Field.init(map.items, row_len, pos);
    defer field.deinit();
    while (try field.move() == .move) {}

    var it = field.visited.keyIterator();
    while (it.next()) |i| {
        const idx = i.*;
        var next_map = try map.clone();
        if (next_map.items[idx] == '#' or idx == pos) {
            continue;
        }
        next_map.items[idx] = '#';

        var next_field = Field.init(next_map.items, row_len, pos);
        defer next_field.deinit();
        var r = try next_field.move();
        while (r == .move) {
            r = try next_field.move();
        }
        if (r == .loop) {
            res_two += 1;
        }
    }

    std.debug.print("Part 1: {d}\n", .{field.resOne()});
    std.debug.print("Part 2: {d}\n", .{res_two});
}
