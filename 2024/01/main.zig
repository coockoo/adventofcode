const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("./2024/01/input.txt", .{});
    defer file.close();

    var bufReader = std.io.bufferedReader(file.reader());
    var reader = bufReader.reader();

    var ls = std.ArrayList(i32).init(std.heap.page_allocator);
    var rs = std.ArrayList(i32).init(std.heap.page_allocator);

    var buf: [128]u8 = undefined;
    while (try reader.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        const ml = std.mem.indexOf(u8, line, " ");
        if (ml) |index| {
            const l = line[0..index];
            const num = try std.fmt.parseInt(i32, l, 10);
            try ls.append(num);
        }

        const mr = std.mem.lastIndexOf(u8, line, " ");
        if (mr) |index| {
            const r = line[(index + 1)..];
            const num = try std.fmt.parseInt(i32, r, 10);
            try rs.append(num);
        }
    }
    std.mem.sort(i32, ls.items, {}, std.sort.asc(i32));
    std.mem.sort(i32, rs.items, {}, std.sort.asc(i32));

    var res: u32 = 0;
    for (ls.items, 0..) |l, idx| {
        const r = rs.items[idx];
        res += @abs(l - r);
    }
    std.debug.print("res: {any}\n", .{res});
    // std.debug.print("ls: {any}\n", .{ls});
    // std.debug.print("rs: {any}\n", .{rs});
}
