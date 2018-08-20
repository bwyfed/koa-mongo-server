const arr1 = ['a', 'b', 'c']
const arr2 = [...arr1, 'foo']

class A {
  constructor() {
    this.aa = 123
  }
}
class B extends A{
  constructor() {
    super()
    this.bb = 456
  }
}