const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/03/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var res_one: u32 = 0;
    var res_two: u32 = 0;
    var do = true;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        for (0..line.len) |idx| {
            const slice = line[idx..];
            if (std.mem.startsWith(u8, slice, "mul(")) {
                const end_maybe = std.mem.indexOfScalarPos(u8, line, idx + 1, ')');
                if (end_maybe) |end| {
                    const mul_slice = line[idx + 4 .. end];
                    var it = std.mem.splitScalar(u8, mul_slice, ',');
                    var local_res: u32 = 1;
                    while (it.next()) |b| {
                        local_res *= std.fmt.parseInt(u32, b, 10) catch 0;
                    }
                    res_one += local_res;
                    if (do) {
                        res_two += local_res;
                    }
                }
            } else if (std.mem.startsWith(u8, slice, "do()")) {
                do = true;
            } else if (std.mem.startsWith(u8, slice, "don't()")) {
                do = false;
            }
        }
    }
    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}
