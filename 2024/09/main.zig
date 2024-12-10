const std = @import("std");
const Allocator = std.mem.Allocator;
const print = std.debug.print;
const assert = std.debug.assert;
const expect = std.testing.expect;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/09/input.txt", .{});
    defer file.close();

    var reader = file.reader();
    const line = try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 20000);

    const res_one = try solve_one(line.?);
    print("Part 1: {d}\n", .{res_one});
    const res_two = try solve_two(allocator, line.?);
    print("Part 2: {d}\n", .{res_two});
}

fn solve_one(line: []const u8) !usize {
    var res: usize = 0;
    var res_index: usize = 0;
    // last element, but if even number – prelast element,  with adjustment +2 to first iteration
    var backward_index: usize = line.len - 1 - ((line.len + 1) % 2) + 2;
    var backward_num: usize = 0;

    for (line, 0..) |c, forward_idx| {
        const num = try std.fmt.parseInt(usize, &[_]u8{c}, 10);
        if (forward_idx % 2 == 0) {
            if (forward_idx >= backward_index) {
                break;
            }
            const weight = @divFloor(forward_idx, 2);
            // TODO: this can be simplified (not loop, but formula)
            for (0..num) |_| {
                res += res_index * weight;
                res_index += 1;
            }
            continue;
        }
        for (0..num) |_| {
            if (backward_num == 0) {
                if (backward_index - 2 <= forward_idx) {
                    break;
                }
                backward_index -= 2;
                backward_num = try std.fmt.parseInt(usize, &.{line[backward_index]}, 10);
            }
            const weight = @divFloor(backward_index, 2);
            res += res_index * weight;
            res_index += 1;
            backward_num -= 1;
        }
    }
    for (0..backward_num) |_| {
        const weight = @divFloor(backward_index, 2);
        res += res_index * weight;
        res_index += 1;
    }

    return res;
}

const Value = struct {
    weight: usize,
    range: usize,
};

const Free = struct {
    range: usize,
};

const Item = union(enum) {
    value: Value,
    free: Free,
};

fn solve_two(allocator: Allocator, line: []const u8) !usize {
    var items = try allocator.alloc(Item, line.len);
    defer allocator.free(items);
    for (line, 0..) |c, idx| {
        const range = try std.fmt.parseInt(usize, &[_]u8{c}, 10);
        if (idx % 2 == 0) {
            const value = Value{ .weight = @divFloor(idx, 2), .range = range };
            items[idx] = Item{ .value = value };
        } else {
            const free = Free{ .range = range };
            items[idx] = Item{ .free = free };
        }
    }

    var idx: usize = items.len - 1 - ((items.len + 1) % 2);
    // condition is based on the overflow
    while (idx < items.len) {
        const item = items[idx];
        switch (item) {
            .value => |value| {
                for (0..idx) |f_idx| {
                    const f_item = items[f_idx];
                    switch (f_item) {
                        .value => continue,
                        .free => |free| {
                            if (free.range == value.range) {
                                items[idx] = Item{ .free = free };
                                items[f_idx] = Item{ .value = value };
                                break;
                            }
                            if (free.range > value.range) {
                                items[idx] = Item{ .free = Free{ .range = value.range } };
                                // TODO: optimize this a bit and allocate same number of items without this free one
                                var new_items = try allocator.alloc(Item, items.len + 1);
                                @memcpy(new_items[0..f_idx], items[0..f_idx]);
                                new_items[f_idx] = Item{ .value = Value{ .range = value.range, .weight = value.weight } };
                                new_items[f_idx + 1] = Item{ .free = Free{ .range = free.range - value.range } };
                                @memcpy(new_items[f_idx + 2 ..], items[f_idx + 1 ..]);
                                allocator.free(items);
                                items = new_items;
                                idx += 1;
                                break;
                            }
                        },
                    }
                }
            },
            .free => {},
        }
        idx -%= 1;
        // break;
    }
    var res: usize = 0;
    var res_idx: usize = 0;
    for (items) |item| {
        switch (item) {
            .value => |value| {
                for (0..value.range) |_| {
                    res += value.weight * res_idx;
                    res_idx += 1;
                }
            },
            .free => |free| {
                res_idx += free.range;
            },
        }
    }
    return res;
}
