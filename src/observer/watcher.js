import { popTarget, pushTarget } from "./dep"
import {queueWatcher} from './schedular'
let id = 0
export default class Watcher{
  constructor(vm, exprOrFn, cb, options){
    this.vm = vm
    this.cb = cb
    this.options = options

    this.id = id++
    this.getter = exprOrFn
    this.deps = []
    this.depsId = new Set()
    this.get() // 调用传入的函数， 调用了render方法 此时会对模板中得数据进行取值

  }
  get () { // 这个方法中会对属性进行取值操作 初始化时dep上就有一个当前watcher
    pushTarget(this) // 保存当前的watcher 
    this.getter()
    popTarget() // 删除watcher 
  }
  addDep (dep){
    let id = dep.id
    if(!this.depsId.has(id)){ // 排除相同的dep dep唯一 那么watcher也去重了
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)// dep记住watcher
    }
    // this.deps.
  }
  run (){
    this.get()
  }
  update(){
    // this.get() // 多次修改同一属性 需要优化只执行一次渲染
    queueWatcher(this) // 拿到第一次watcher  （watcher执行是异步的）执行render函数时反正会去拿最新的值
  }

  // 当属性取值时 需要记住这个watcher， 稍后数据变化了，去执行自己记住的watcher
}





