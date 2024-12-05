const std = @import("std");

const User = struct {
    id: u64,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // this is a constant pointer *User 0x1abc00
    const user = try allocator.create(User);
    // pointer is still points to 0x1abc00
    user.id = 123;
    // pointer is still points to 0x1abc00
    user.*.id = 846;

    std.debug.print("user is here {d} {d}\n", .{ user.id, user.*.id });
}
