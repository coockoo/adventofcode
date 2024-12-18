const std = @import("std");
const print = std.debug.print;

const Robot = struct {
    x0: isize,
    y0: isize,
    dx: isize,
    dy: isize,
};

const w: isize = 101;
const h: isize = 103;
//const w: isize = 11;
//const h: isize = 7;
const w2: isize = @divFloor(w, 2);
const h2: isize = @divFloor(h, 2);

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = try std.fs.cwd().openFile("./2024/14/input.txt", .{});
    defer file.close();
    var reader = file.reader();

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
    const res_two = solveTwo(robots.items);
    print("Part 2: {d}\n", .{res_two});
    printRobots(robots.items, @as(isize, @intCast(res_two)));
}

fn allUnique(robots: []Robot, step: isize) bool {
    for (robots, 0..) |robota, ai| {
        for (robots, 0..) |robotb, bi| {
            if (ai == bi) {
                continue;
            }
            const axy = getxy(robota, step);
            const ax = axy.x;
            const ay = axy.y;

            const bxy = getxy(robotb, step);
            const bx = bxy.x;
            const by = bxy.y;

            if (ax == bx and ay == by) {
                return false;
            }
        }
    }
    return true;
}

fn printRobots(robots: []Robot, step: isize) void {
    for (0..h) |y| {
        for (0..w) |x| {
            var found = false;
            for (robots) |robot| {
                const xy = getxy(robot, step);
                const rx = xy.x;
                const ry = xy.y;
                if (rx == x and ry == y) {
                    found = true;
                    print("#", .{});
                    break;
                }
            }
            if (!found) {
                print(".", .{});
            }
        }
        print("\n", .{});
    }
}

fn solveOne(robots: []Robot) usize {
    var a: usize = 0;
    var b: usize = 0;
    var c: usize = 0;
    var d: usize = 0;

    for (robots) |robot| {
        const xy = getxy(robot, 100);
        const x = xy.x;
        const y = xy.y;

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

fn solveTwo(robots: []Robot) usize {
    for (0..10000) |s| {
        if (allUnique(robots, @as(isize, @intCast(s)))) {
            return s;
        }
    }
    return 0;
}

const XY = struct {
    x: isize,
    y: isize,
};

fn getxy(robot: Robot, t: isize) XY {
    const x = @mod(robot.x0 + robot.dx * t, w);
    const y = @mod(robot.y0 + robot.dy * t, h);
    return XY{ .x = x, .y = y };
}
