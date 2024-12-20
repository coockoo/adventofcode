const std = @import("std");
const print = std.debug.print;
const startsWith = std.mem.startsWith;

const Tile = enum { empty, box, wall };
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

    var pos: Pos = undefined;

    var y: isize = -1;
    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 1024)) |line| {
        if (line.len <= 0) {
            continue;
        }
        const first = line[0];
        if (first == '#') {
            y += 1;
            const row = try allocator.alloc(Tile, line.len);
            for (line, 0..) |c, x| {
                row[x] = switch (c) {
                    '#' => .wall,
                    '.' => .empty,
                    '@' => .empty,
                    'O' => .box,
                    else => unreachable,
                };
                if (c == '@') {
                    pos = Pos{ .y = y, .x = @intCast(x) };
                }
            }
            try grid.append(row);
            continue;
        }
        // printGrid(&grid.items, pos);
        // print("\n", .{});

        if (std.mem.indexOfScalar(u8, "^v><", first) != null) {
            for (line) |c| {
                pos = move(&grid.items, pos, c);
                // printGrid(&grid.items, pos);
                // print("\n", .{});
            }
        }
    }

    print("Part 1: {d}\n", .{sum(&grid.items)});
    print("Part 2: {d}\n", .{0});
}

fn move(grid: *[][]Tile, pos: Pos, c: u8) Pos {
    const next_pos: Pos = switch (c) {
        '<' => .{ .x = pos.x - 1, .y = pos.y },
        '>' => .{ .x = pos.x + 1, .y = pos.y },
        '^' => .{ .x = pos.x, .y = pos.y - 1 },
        'v' => .{ .x = pos.x, .y = pos.y + 1 },
        else => unreachable,
    };
    if (!isValid(grid, next_pos)) {
        return pos;
    }
    switch (grid.*[@abs(next_pos.y)][@abs(next_pos.x)]) {
        .empty => {
            std.mem.swap(Tile, &grid.*[@abs(next_pos.y)][@abs(next_pos.x)], &grid.*[@abs(pos.y)][@abs(pos.x)]);
            return next_pos;
        },
        .wall => return pos,
        .box => {
            if (posEql(next_pos, move(grid, next_pos, c))) {
                return pos;
            }
            _ = move(grid, pos, c);
            return next_pos;
        },
    }
}

fn isValid(grid: *[][]Tile, pos: Pos) bool {
    return pos.y >= 0 and pos.y < grid.len and pos.x >= 0 and pos.x < grid.*[@abs(pos.y)].len;
}

fn posEql(a: Pos, b: Pos) bool {
    return a.x == b.x and a.y == b.y;
}

fn printGrid(grid: *[][]Tile, pos: Pos) void {
    for (0..grid.len) |y| {
        for (0..grid.*[y].len) |x| {
            var c: u8 = undefined;
            if (pos.y == y and pos.x == x) {
                c = '@';
            } else {
                c = switch (grid.*[y][x]) {
                    .empty => '.',
                    .box => 'O',
                    .wall => '#',
                };
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
            if (grid.*[y][x] == .box) {
                res += 100 * y + x;
            }
        }
    }
    return res;
}
