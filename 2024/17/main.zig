const std = @import("std");
const print = std.debug.print;
const parseInt = std.fmt.parseInt;
const Allocator = std.mem.Allocator;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/17/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var a: usize = undefined;
    var b: usize = undefined;
    var c: usize = undefined;

    var prog = std.ArrayList(usize).init(allocator);
    defer prog.deinit();

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        if (std.mem.startsWith(u8, line, "Register A:")) {
            a = try parseInt(usize, line[12..], 10);
        } else if (std.mem.startsWith(u8, line, "Register B:")) {
            b = try parseInt(usize, line[12..], 10);
        } else if (std.mem.startsWith(u8, line, "Register C:")) {
            c = try parseInt(usize, line[12..], 10);
        } else if (std.mem.startsWith(u8, line, "Program:")) {
            var it = std.mem.splitScalar(u8, line[9..], ',');
            while (it.next()) |i_str| {
                const i = try parseInt(usize, i_str, 10);
                try prog.append(i);
            }
        }
    }

    var i: usize = 0;
    var out = std.ArrayList(usize).init(allocator);
    defer out.deinit();

    print("pl: {d}, a: {d}; b: {d}; c: {d}\n", .{ prog.items.len, a, b, c });

    while (i < prog.items.len) : (i +%= 2) {
        const opcode = prog.items[i];
        const operand = prog.items[i + 1];
        const combo = opcode == 0 or opcode == 2 or opcode == 5 or opcode == 6 or opcode == 7;
        const value: usize = if (combo) switch (operand) {
            0...3 => operand,
            4 => a,
            5 => b,
            6 => c,
            else => unreachable,
        } else operand;
        switch (opcode) {
            0 => a = dv(a, value),
            1 => b ^= value,
            2 => b = @mod(value, 8),
            3 => {
                if (a != 0) {
                    i = value;
                    // two to compensate for i+=2 on each step;
                    i -%= 2;
                }
            },
            4 => b ^= c,
            5 => try out.append(@mod(value, 8)),
            6 => b = dv(a, value),
            7 => c = dv(a, value),
            else => unreachable,
        }
        print("opcode: {d}; operand: {d}; value: {d}\n", .{ opcode, operand, value });
        print("a: {d}; b: {d}; c: {d}\n", .{ a, b, c });
    }

    print("Part 1: {s} {d}\n", .{ try join(allocator, out.items), out.items.len });
    print("Part 2: {d}\n", .{0});
}

fn dv(a: usize, value: usize) usize {
    return @divFloor(a, std.math.pow(usize, 2, value));
}

fn join(allocator: Allocator, arr: []const usize) ![]const u8 {
    // TODO: memory leak here? Probably yes
    const slices = try allocator.alloc([]u8, arr.len);
    for (arr, 0..) |item, i| {
        slices[i] = try std.fmt.allocPrint(allocator, "{d}", .{item});
    }
    return try std.mem.join(allocator, ",", slices);
}
