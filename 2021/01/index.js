const fs = require('fs')
const path = require('path')

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), { encoding: 'utf8' })
const arr = input.split(/\n/).map(i => +i)

module.exports.part1 = () => {
  let res = 0;
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i] > arr[i - 1]) {
      res += 1
    }
  }
  return res
}

module.exports.part2 = () => {
  let res = 0;
  let window = arr[0] + arr[1] + arr[2]
  for (let i = 3; i< arr.length; ++i) {
    const newWindow = window + arr[i] - arr[i - 3]
    if (newWindow > window) {
      res += 1
    }
    window = newWindow
  }
  return res
}

console.log(module.exports.part1())
