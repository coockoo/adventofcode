const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/02/input.txt", .{});
    defer file.close();

    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [128]u8 = undefined;
    var res: usize = 0;
    var extra_res: usize = 0;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        const list = try parseLine(line);
        defer list.deinit();
        const failed_index = getFailedIndex(list.items);
        if (failed_index == null) {
            res += 1;
            continue;
        }

        const suspects: [3]usize = .{ 0, failed_index.? - 1, failed_index.? };
        for (suspects) |i| {
            var try_list = try list.clone();
            _ = try_list.orderedRemove(i);
            if (getFailedIndex(try_list.items) == null) {
                extra_res += 1;
                break;
            }
        }
    }

    std.debug.print("Part 1: {d}\n", .{res});
    std.debug.print("Part 2: {d}\n", .{res + extra_res});
}

fn parseLine(line: []const u8) !std.ArrayList(i32) {
    var res = std.ArrayList(i32).init(std.heap.page_allocator);
    var it = std.mem.splitScalar(u8, line, ' ');
    while (it.next()) |num_str| {
        const num = try std.fmt.parseInt(i32, num_str, 10);
        try res.append(num);
    }
    return res;
}

fn getFailedIndex(items: []i32) ?usize {
    var current = items[0];
    var next = items[1];
    var failed_index: ?usize = null;
    var sign: i32 = next - current;
    for (items[1..], 1..) |item, index| {
        next = item;
        const diff = next - current;
        const abs_diff = @abs(diff);
        if (abs_diff < 1 or abs_diff > 3 or (sign < 0 and diff > 0) or (sign > 0 and diff < 0)) {
            failed_index = index;
            break;
        }
        sign = diff;
        current = next;
    }
    return failed_index;
}
