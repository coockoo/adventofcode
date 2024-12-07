const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/07/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var res_one: usize = 0;
    var res_two: usize = 0;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var it = std.mem.splitScalar(u8, line, ' ');
        const res_str_maybe = it.next();
        if (res_str_maybe) |res_str| {
            const res = try std.fmt.parseInt(usize, res_str[0 .. res_str.len - 1], 10);
            var nums = std.ArrayList(usize).init(std.heap.page_allocator);
            defer nums.deinit();
            while (it.next()) |num_str| {
                const num = try std.fmt.parseInt(usize, num_str, 10);
                try nums.append(num);
            }
            if (eval(res, 0, nums.items, false)) {
                res_one += res;
                res_two += res;
            } else if (eval(res, 0, nums.items, true)) {
                res_two += res;
            }
        }
    }
    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

pub fn eval(res: usize, current: usize, nums: []const usize, concat: bool) bool {
    if (nums.len == 0) {
        return res == current;
    }
    if (current > res) {
        return false;
    }
    const first = nums[0];
    const nums_next = nums[1..];
    if (current == 0) {
        return eval(res, first, nums_next, concat);
    }
    if (eval(res, current * first, nums_next, concat)) {
        return true;
    }
    if (eval(res, current + first, nums_next, concat)) {
        return true;
    }
    if (concat) {
        const d = std.math.log10_int(first) + 1;
        const pow = std.math.pow(usize, 10, d);
        const next_current = current * pow + first;
        if (eval(res, next_current, nums_next, concat)) {
            return true;
        }
    }
    return false;
}
