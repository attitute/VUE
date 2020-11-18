

let oldArrayProtoMethods = Array.prototype

// 不能直接修改数组得方法 只有vue中的数组方法才需要更改 使用object.create()创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 
export let arrayMethods = Object.create(Array.prototype)

let methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'reverse',
  'sort'
]

methods.forEach( methods => { // 切片编程AOP 
  arrayMethods[methods] = function (...args) { // 重写数组的方法
    let result = oldArrayProtoMethods[methods].call(this, ...args)
    // 有可能用户新增的数据是对象 也需要进行拦截
    let inserted;
    let ob = this.__ob__
    switch (methods) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // splice(0, 1, xxxx)
        inserted = args.slice(2)
      default: 
      break
    }
    // 这边的this是value 谁调用 this就指向谁
    if (inserted) {
      ob.observeArray(inserted)
      ob.dep.notify() // 调用当前数组绑定的Observer中的dep的更新方法
    }
    return result
  }
})
// arrayMethods.push(1,2,3,4)

