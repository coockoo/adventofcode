# Adventofcode

Solutions to [AoC][aoc] problems.

## Discoveries

### Let it snow

In javascript always use `let` over `const`. There is simply too many times that require variable reassigning:
chaged value, parsing, permutation etc.

### Last row

The last row of the text input is empty string. Due to this there might be bugs in the program.

### Number

If the input is of `number` type – always convert it to `number`, as string comparison does not work well with `10+` values.

### Have trust in AoC

Don't do input trimming. Sometimes spaces at the start of the input are necessary.

[aoc]: https://adventofcode.com/
