const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/03/input.txt", .{});
    defer file.close();

    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var res_one: i32 = 0;
    var res_two: i32 = 0;
    var do = true;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        const res = processLine(line, do);
        do = res.do;
        res_one += res.sum_total;
        res_two += res.sum_with_do;
    }
    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

const Result = struct { sum_total: i32, sum_with_do: i32, do: bool };

fn processLine(line: []const u8, initial_do: bool) Result {
    var sum_with_do: i32 = 0;
    var sum_total: i32 = 0;
    var do = initial_do;
    for (0..line.len) |idx| {
        if (idx + 4 < line.len and std.mem.eql(u8, line[idx .. idx + 4], "mul(")) {
            const end_maybe = std.mem.indexOfScalarPos(u8, line, idx + 1, ')');
            if (end_maybe) |end| {
                const slice = line[idx + 4 .. end];
                var it = std.mem.splitScalar(u8, slice, ',');
                var local_res: i32 = 1;
                if (it.next()) |buf| {
                    local_res *= std.fmt.parseInt(i32, buf, 10) catch 0;
                }
                if (it.next()) |buf| {
                    local_res *= std.fmt.parseInt(i32, buf, 10) catch 0;
                }
                if (it.next() == null) {
                    sum_total += local_res;
                    if (do) {
                        sum_with_do += local_res;
                    }
                }
            }
            continue;
        }

        if (idx + 4 < line.len and std.mem.eql(u8, line[idx .. idx + 4], "do()")) {
            do = true;
        }

        if (idx + 7 < line.len and std.mem.eql(u8, line[idx .. idx + 7], "don't()")) {
            do = false;
        }
    }
    return Result{ .sum_total = sum_total, .sum_with_do = sum_with_do, .do = do };
}
