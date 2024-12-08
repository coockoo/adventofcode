## Pass-by-value Parameters

Parameters are immutable (wow, this is cool concept). Primitive values are passed by value.
Structs can be passed by reference or by value (zig decides which is faster).

[Docs](https://ziglang.org/documentation/master/#toc-Pass-by-value-Parameters)

## Casting

It sucks big time.

`usize` and `isize`

## Overflow operator

Mind blowing.

```zig
test "well defined overflow" {
    var a: u8 = 255;
    a +%= 1;
    try expect(a == 0); // ok
}
```

## Pointers and values

Zig understands where there are value or pointer and there is no weird `->` or `.` syntax depening on
if it's pointer or value.

```zig
var user = try allocator.create(User); // returns *User
user.id = 846;
// can be used in both ways
std.debug.print("user is here {d} {d}\n", .{ user.id, user.*.id });
```

## Constant values and constant pointers

```zig
// this is a constant pointer *User 0x1abc00
const user_pointer = try allocator.create(User);
// pointer is still points to 0x1abc00
user_pointer.id = 123;
// pointer is still points to 0x1abc00
user_pointer.*.id = 846;

const user = User{ .id = 123 };
user.id = 5; // cannot assign to constant
```

## memcpy

```zig
// copy the items we previously added to our new space
@memcpy(larger[0..len], self.items);
```
