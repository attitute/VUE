import { arrayMethods } from './array'
import { Dep } from './dep'

class Observer {
  constructor(value) {
    this.dep = new Dep() // 给数组和对象添加dep属性
    // 把当前Observer类的this 在value上储存起来
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false, // 不能被枚举
      configurable: false // 不能删除
    })
    // 需要对这个value属性重新定义
    if (Array.isArray(value)) {
      // 数组不需要defineprototype做代理 性能不好

      // 给vue中的数组重写数组方法 数组实例指向改变__proto__
      Object.setPrototypeOf(value, arrayMethods)
      this.observeArray(value) // 处理原有数组中的对象
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    value.forEach((v) => {
      observe(v)
    })
  }
  walk(data) {
    // 将对象中所有的key 定义成响应式
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

function dependArray(value) {
  value.forEach(v=>{
    v.__ob__ && v.__ob__.dep.depend()
    if (Array.isArray(v))dependArray(v)
  })
}

function defineReactive(data, key, value) {
  let childOb = observe(value) // value可能也是个对象 对象套对象
  let dep = new Dep() // 每次存取值都会创建一个Dep 给属性加dep
  Object.defineProperty(data, key, {
    set(newValue) {
      if (newValue === value) return
      observe(newValue) // 新设置的值可能也是个对象
      value = newValue
      dep.notify();// 通知dep中记录的watcher让它去执行
    },
    get() {
      if(Dep.target){
        dep.depend() // 让dep记住watcher 
        // childOb 可能是对象和数组
        if (childOb) { // 如果对数组取值 将数组与当前watcher关联
          childOb.dep.depend()
          if(Array.isArray(value)) { // 如果值是数组得再次操作
            dependArray(value)
          }
        }
      }
      return value
    },
  })
}

export function observe(data) {
  // 只对对象类型进行观测 非对象类型不观测
  if (typeof data !== 'object' || data === null) return
  return new Observer(data)
}
