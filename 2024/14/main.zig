const std = @import("std");
const print = std.debug.print;

const Robot = struct {
    x0: isize,
    y0: isize,
    dx: isize,
    dy: isize,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/14/input.txt", .{});
    defer file.close();
    var reader = file.reader();

    var res_two: isize = 0;
    res_two += 0;

    var robots = std.ArrayList(Robot).init(allocator);
    defer robots.deinit();

    while (try reader.readUntilDelimiterOrEofAlloc(allocator, '\n', 150)) |line| {
        var it = std.mem.splitScalar(u8, line, ' ');

        var zero_it = std.mem.splitScalar(u8, it.next().?[2..], ',');
        const x0: isize = try std.fmt.parseInt(isize, zero_it.next().?, 10);
        const y0: isize = try std.fmt.parseInt(isize, zero_it.next().?, 10);

        var d_it = std.mem.splitScalar(u8, it.next().?[2..], ',');
        const dx: isize = try std.fmt.parseInt(isize, d_it.next().?, 10);
        const dy: isize = try std.fmt.parseInt(isize, d_it.next().?, 10);

        try robots.append(.{ .x0 = x0, .y0 = y0, .dx = dx, .dy = dy });
    }

    print("Part 1: {d}\n", .{solveOne(robots.items)});
    print("Part 2: {d}\n", .{res_two});
}

fn solveOne(robots: []Robot) usize {
    const w: isize = 101;
    const h: isize = 103;
    // const w: isize = 11;
    //const h: isize = 7;
    const w2: isize = @divFloor(w, 2);
    const h2: isize = @divFloor(h, 2);
    const t: isize = 100;

    var a: usize = 0;
    var b: usize = 0;
    var c: usize = 0;
    var d: usize = 0;

    for (robots) |robot| {
        const x0 = robot.x0;
        const y0 = robot.y0;
        const dx = robot.dx;
        const dy = robot.dy;

        const x = @mod(x0 + dx * t, w);
        const y = @mod(y0 + dy * t, h);
        if (x < w2 and y < h2) {
            a += 1;
        }
        if (x > w2 and y < h2) {
            b += 1;
        }
        if (x < w2 and y > h2) {
            c += 1;
        }
        if (x > w2 and y > h2) {
            d += 1;
        }
    }

    return a * b * c * d;
}
