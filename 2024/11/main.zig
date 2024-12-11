const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/11/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var map = std.AutoHashMap(usize, usize).init(allocator);

    const line = try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 64);
    var it = std.mem.split(u8, line.?, " ");
    while (it.next()) |num_str| {
        const num = try std.fmt.parseInt(usize, num_str, 10);
        try map.put(num, (map.get(num) orelse 0) + 1);
    }

    // TODO: make it work for 25 and 75 too
    for (0..75) |_| {
        var new_map = std.AutoHashMap(usize, usize).init(allocator);

        var map_id = map.iterator();
        while (map_id.next()) |entry| {
            const item = entry.key_ptr.*;
            const times = entry.value_ptr.*;
            if (item == 0) {
                const new_item: usize = 1;
                try new_map.put(new_item, (new_map.get(new_item) orelse 0) + times);
                continue;
            }
            const d = std.math.log10_int(item) + 1;
            if (d % 2 == 0) {
                const pow = std.math.pow(usize, 10, @divFloor(d, 2));
                const l_item = @divFloor(item, pow);
                try new_map.put(l_item, (new_map.get(l_item) orelse 0) + times);
                const r_item = item % pow;
                try new_map.put(r_item, (new_map.get(r_item) orelse 0) + times);
                continue;
            }
            const o_item = item * 2024;
            try new_map.put(o_item, (new_map.get(o_item) orelse 0) + times);
        }

        map.deinit();
        map = new_map;
    }

    // var res_one: usize = 0;
    var res_two: usize = 0;

    var res_it = map.valueIterator();
    var i: usize = 0;
    while (res_it.next()) |val| {
        res_two += val.*;
        i += 1;
    }
    // print("Part 1: {d}\n", .{res_one});
    print("Part 2: {d}\n", .{res_two});
}
