const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/13/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var a: isize = undefined;
    var b: isize = undefined;
    var c: isize = undefined;
    var d: isize = undefined;
    var e: isize = undefined;
    var f: isize = undefined;

    var res_one: isize = 0;
    var res_two: isize = 0;

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        if (std.mem.startsWith(u8, line, "Button A:")) {
            var it = std.mem.splitScalar(u8, line[11..], ',');
            a = try std.fmt.parseInt(isize, it.next().?, 10);
            b = try std.fmt.parseInt(isize, it.next().?[3..], 10);
        }

        if (std.mem.startsWith(u8, line, "Button B:")) {
            var it = std.mem.splitScalar(u8, line[11..], ',');
            c = try std.fmt.parseInt(isize, it.next().?, 10);
            d = try std.fmt.parseInt(isize, it.next().?[3..], 10);
        }

        if (std.mem.startsWith(u8, line, "Prize:")) {
            var it = std.mem.splitScalar(u8, line[9..], ',');
            e = try std.fmt.parseInt(isize, it.next().?, 10);
            f = try std.fmt.parseInt(isize, it.next().?[3..], 10);

            const g = 10000000000000;
            res_one += calcRes(a, b, c, d, e, f);
            res_two += calcRes(a, b, c, d, e + g, f + g);
        }
    }

    print("Part 1: {d}\n", .{res_one});
    print("Part 2: {d}\n", .{res_two});
}

// solve the system of 2 linear equations with only integer x and y
fn calcRes(a: isize, b: isize, c: isize, d: isize, e: isize, f: isize) isize {
    const dividend: isize = c * f - d * e;
    const divisor: isize = c * b - d * a;
    if (@mod(dividend, divisor) == 0) {
        const x = @divExact(dividend, divisor);
        if (@mod(e - a * x, c) == 0) {
            const y = @divExact(e - a * x, c);
            return 3 * x + y;
        }
    }
    return 0;
}
