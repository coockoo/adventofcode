const std = @import("std");
const Allocator = std.mem.Allocator;
const print = std.debug.print;
const startsWith = std.mem.startsWith;

const Tile = enum { empty, box, wall, box_l, box_r };
const Pos = struct { y: isize, x: isize };

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var arena = std.heap.ArenaAllocator.init(gpa.allocator());
    defer arena.deinit();
    const allocator = arena.allocator();

    const file = try std.fs.cwd().openFile("./2024/15/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var grid = std.ArrayList([]Tile).init(allocator);
    defer grid.deinit();

    var grid_two = std.ArrayList([]Tile).init(allocator);
    defer grid_two.deinit();

    var pos: Pos = undefined;
    var pos_two: Pos = undefined;

    var y: isize = -1;
    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 1024)) |line| {
        if (line.len <= 0) {
            continue;
        }
        const first = line[0];
        if (first == '#') {
            y += 1;
            const row = try allocator.alloc(Tile, line.len);
            const row_two = try allocator.alloc(Tile, line.len * 2);
            for (line, 0..) |c, x| {
                row[x] = switch (c) {
                    '#' => .wall,
                    '.' => .empty,
                    '@' => .empty,
                    'O' => .box,
                    else => unreachable,
                };
                row_two[x * 2] = switch (c) {
                    '#' => .wall,
                    '.' => .empty,
                    '@' => .empty,
                    'O' => .box_l,
                    else => unreachable,
                };
                row_two[x * 2 + 1] = switch (c) {
                    '#' => .wall,
                    '.' => .empty,
                    '@' => .empty,
                    'O' => .box_r,
                    else => unreachable,
                };
                if (c == '@') {
                    pos = Pos{ .y = y, .x = @intCast(x) };
                    pos_two = Pos{ .y = y, .x = @intCast(x * 2) };
                }
            }
            try grid.append(row);
            try grid_two.append(row_two);
            continue;
        }

        if (std.mem.indexOfScalar(u8, "^v><", first) != null) {
            for (line) |c| {
                pos = try move(allocator, &grid.items, pos, c);
                pos_two = try move(allocator, &grid_two.items, pos_two, c);
            }
        }
    }

    print("Part 1: {d}\n", .{sum(&grid.items)});
    print("Part 2: {d}\n", .{sum(&grid_two.items)});
}

fn move(allocator: Allocator, grid: *[][]Tile, initial_pos: Pos, c: u8) !Pos {
    const v = c == 'v' or c == '^';
    var queue = std.ArrayList(Pos).init(allocator);
    defer queue.deinit();

    try queue.append(initial_pos);
    var idx: usize = 0;
    while (idx < queue.items.len) : (idx += 1) {
        const pos = queue.items[idx];
        const next_pos_maybe = getNextPos(grid, pos, c);
        if (next_pos_maybe) |next_pos| {
            const next_val = grid.*[@abs(next_pos.y)][@abs(next_pos.x)];
            switch (next_val) {
                .empty => {},
                .wall => return initial_pos,
                .box => try queue.append(next_pos),
                .box_l => {
                    try queue.append(next_pos);
                    if (v) {
                        try queue.append(.{ .x = next_pos.x + 1, .y = next_pos.y });
                    }
                },
                .box_r => {
                    try queue.append(next_pos);
                    if (v) {
                        try queue.append(.{ .x = next_pos.x - 1, .y = next_pos.y });
                    }
                },
            }
        } else {
            return initial_pos;
        }
    }
    var visited = std.AutoHashMap(Pos, bool).init(allocator);
    defer visited.deinit();
    var it = std.mem.reverseIterator(queue.items);
    while (it.next()) |pos| {
        if (visited.contains(pos)) {
            continue;
        }
        try visited.put(pos, true);
        const next_pos = getNextPos(grid, pos, c).?;
        std.mem.swap(Tile, &grid.*[@abs(next_pos.y)][@abs(next_pos.x)], &grid.*[@abs(pos.y)][@abs(pos.x)]);
    }
    return getNextPos(grid, initial_pos, c).?;
}

fn getNextPos(grid: *[][]Tile, pos: Pos, c: u8) ?Pos {
    const next_pos: Pos = switch (c) {
        '<' => .{ .x = pos.x - 1, .y = pos.y },
        '>' => .{ .x = pos.x + 1, .y = pos.y },
        '^' => .{ .x = pos.x, .y = pos.y - 1 },
        'v' => .{ .x = pos.x, .y = pos.y + 1 },
        else => unreachable,
    };
    if (!isValid(grid, next_pos)) {
        return null;
    }
    return next_pos;
}

fn isValid(grid: *[][]Tile, pos: Pos) bool {
    return pos.y >= 0 and pos.y < grid.len and pos.x >= 0 and pos.x < grid.*[@abs(pos.y)].len;
}

fn printGrid(grid: *[][]Tile, pos_maybe: ?Pos) void {
    for (0..grid.len) |y| {
        for (0..grid.*[y].len) |x| {
            var c: u8 = switch (grid.*[y][x]) {
                .empty => '.',
                .box => 'O',
                .box_l => '[',
                .box_r => ']',
                .wall => '#',
            };
            if (pos_maybe) |pos| {
                if (pos.y == y and pos.x == x) {
                    c = '@';
                }
            }
            print("{c}", .{c});
        }
        print("\n", .{});
    }
}

fn sum(grid: *[][]Tile) usize {
    var res: usize = 0;
    for (0..grid.len) |y| {
        for (0..grid.*[y].len) |x| {
            const tile = grid.*[y][x];
            if (tile == .box or tile == .box_l) {
                res += 100 * y + x;
            }
        }
    }
    return res;
}
