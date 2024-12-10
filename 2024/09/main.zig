const std = @import("std");
const Allocator = std.mem.Allocator;
const print = std.debug.print;
const assert = std.debug.assert;
const expect = std.testing.expect;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/09/demo.txt", .{});
    defer file.close();

    var reader = file.reader();
    const line = try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 20000);

    // const res_one = try solve_one(line.?);
    // print("Part 1: {d}\n", .{res_one});
    const res_two = try solve_two(line.?);
    print("Part 2: {d}\n", .{res_two});
}

fn solve_one(line: []const u8) !usize {
    var res: usize = 0;
    var res_index: usize = 0;
    // last element, but if even number – prelast element,  with adjustment +2 to first iteration
    var backward_index: usize = line.len - 1 - ((line.len + 1) % 2) + 2;
    var backward_num: usize = 0;

    for (line, 0..) |c, forward_idx| {
        // print("forward_idx: {d} backward_idx: {d}\n", .{ forward_idx, backward_index });
        const num = try std.fmt.parseInt(usize, &[_]u8{c}, 10);
        // print("num: {d} idx: {d} forward_idx {d}\n", .{ num, idx, forward_idx });
        if (forward_idx % 2 == 0) {
            if (forward_idx >= backward_index) {
                // print("f: break\n", .{});
                break;
            }
            const weight = @divFloor(forward_idx, 2);
            // TODO: this can be simplified (not loop, but formula)
            for (0..num) |_| {
                res += res_index * weight;
                // print("f: {d}:{d}\n", .{ res_index, weight });
                res_index += 1;
            }
            continue;
        }
        for (0..num) |_| {
            if (backward_num == 0) {
                if (backward_index - 2 <= forward_idx) {
                    // print("b: break\n", .{});
                    break;
                }
                backward_index -= 2;
                backward_num = try std.fmt.parseInt(usize, &.{line[backward_index]}, 10);
            }
            const weight = @divFloor(backward_index, 2);
            res += res_index * weight;
            // print("b: {d}:{d}\n", .{ res_index, weight });
            res_index += 1;
            backward_num -= 1;
        }
    }
    // print("res before: {d}\n", .{res});
    // print("remainder: {d} of {d} res_index: {d}\n", .{ backward_num, backward_index, res_index });
    for (0..backward_num) |_| {
        const weight = @divFloor(backward_index, 2);
        // print("weight: {d}\n", .{weight});
        res += res_index * weight;
        res_index += 1;
    }

    // print("res: {d}\n", .{res});
    return res;
}

fn solve_two(line: []const u8) !usize {
    var backward_index: usize = line.len - 1 - ((line.len + 1) % 2);
    while (backward_index > 0) {
        var forward_index: usize = 1;
        forward_index += 0;
        while (forward_index < backward_index) {
            // const backward_num = try std.fmt.parseInt(usize, &[_]u8{line[backward_index]}, 10);
            // print("backward num {d}\n", .{backward_num});
            forward_index += 2;
        }
        backward_index -= 2;
    }
    return 0;
    // TODO:
}
