import { arrayMethods } from './array'

class Observer {
  constructor(value) {
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
function defineReactive(data, key, value) {
  observe(value) // value可能也是个对象 对象套对象
  Object.defineProperty(data, key, {
    set(newValue) {
      if (newValue === value) return
      observe(newValue) // 新设置的值可能也是个对象
      value = newValue
    },
    get() {
      console.log(key)
      return value
    },
  })
}

export function observe(data) {
  // 只对对象类型进行观测 非对象类型不观测
  if (typeof data !== 'object' || data === null) return
  return new Observer(data)
}
