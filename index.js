
class B {
  constructor() {
    console.log('B class')
  }
}
class A extends B{
  constructor() {
    super()
    console.log('A class')
  }
}
const a = new A()
const b = new B()

const obj1 = {
  a: 1,
  b: 2
}

const obj2 = {
  c: 3,
  d: 4
}

const obj = {
  ...obj1,
  ...obj2
}
console.log(obj)

module.exports = A

// console.log(config)
// module.exports = config
