
let id = 0
export default class Watcher{
  constructor(vm, exprOrFn, cb, options){
    this.vm = vm
    this.cb = cb
    this.options = options

    this.id = id++
    this.getter = exprOrFn

    this.get() // 调用传入的函数， 调用了render方法 此时会对模板中得数据进行取值

  }
  get () { // 这个方法中会对属性进行取值操作
    this.getter()
  }
}








