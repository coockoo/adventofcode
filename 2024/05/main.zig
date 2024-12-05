const std = @import("std");

const Rule = struct {
    l: usize,
    r: usize,
};

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/05/input.txt", .{});
    defer file.close();
    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();
    var buf: [4096]u8 = undefined;
    var res_one: usize = 0;
    var res_two: usize = 0;
    var rules = std.ArrayList(Rule).init(std.heap.page_allocator);
    defer rules.deinit();

    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        if (std.mem.indexOfScalar(u8, line, '|')) |index| {
            const l = try std.fmt.parseInt(usize, line[0..index], 10);
            const r = try std.fmt.parseInt(usize, line[index + 1 ..], 10);
            try rules.append(.{ .l = l, .r = r });
            continue;
        }
        if (line.len == 0 or std.mem.startsWith(u8, line, " ")) {
            continue;
        }

        var nums = std.ArrayList(usize).init(std.heap.page_allocator);
        defer nums.deinit();
        var it = std.mem.splitScalar(u8, line, ',');
        while (it.next()) |num_str| {
            const num = try std.fmt.parseInt(usize, num_str, 10);
            try nums.append(num);
        }

        var broken_rule_maybe = getBrokenRule(nums.items, rules.items);
        if (broken_rule_maybe == null) {
            res_one += nums.items[@divFloor(nums.items.len, 2)];
            continue;
        }
        while (broken_rule_maybe) |broken_rule| {
            std.mem.swap(usize, &nums.items[broken_rule.l], &nums.items[broken_rule.r]);
            broken_rule_maybe = getBrokenRule(nums.items, rules.items);
        }
        res_two += nums.items[@divFloor(nums.items.len, 2)];
    }

    std.debug.print("Part 1: {d}\n", .{res_one});
    std.debug.print("Part 2: {d}\n", .{res_two});
}

fn getBrokenRule(nums: []const usize, rules: []const Rule) ?Rule {
    for (rules) |rule| {
        const l_idx_maybe = std.mem.indexOfScalar(usize, nums, rule.l);
        const r_idx_maybe = std.mem.indexOfScalar(usize, nums, rule.r);
        if (l_idx_maybe) |l_idx| {
            if (r_idx_maybe) |r_idx| {
                if (l_idx > r_idx) {
                    return .{ .l = l_idx, .r = r_idx };
                }
            }
        }
    }
    return null;
}
