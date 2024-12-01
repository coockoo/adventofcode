const std = @import("std");

pub fn main() void {
    var res: u8 = 0;
    var i: u8 = 0;
    while (i < 3) : (i += 1) {
        res += i;
    }

    const a = [_]i32{ 1, 2, 3, 4, 5 };
    var end: usize = 3;
    // const b = a[1..3];
    end += 1;
    var b = a[1..end];
    b[1] = 11;
    std.debug.print("a: {any}\n", .{@TypeOf(a)});
    std.debug.print("b: {any}\n", .{@TypeOf(b)});

    std.debug.print("asldfkj {x}\n", .{res});
}
