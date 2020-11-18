
let callbacks = []
let waiting = false

function flushCallbacks(){
  callbacks.forEach(val =>val());
  waiting = false
  callbacks = []
}

// 批处理更新 ： 既然是放入到数组中 每次执行一个异步 不如直接先更新数组 到不更新为止 再调用一次异步即可


// 异步执行函数
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    waiting = true
    // 1. promise 、mutationObserver、setTmmdiate、setTimeout 
    // vue3 直接使用promise

    Promise.resolve().then(flushCallbacks)
  }
}

export const isObject = (val) => typeof val == 'object' && val != null

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted'
]

const starts = {}

// 将所有相同的生命周期 放在同一个数组中
// 第一个parent是一个空对象 肯定没值
function mergeHook(parent,child) {
  if(child){
    if (parent){
      return parent.concat(child)
    } else { // 第一次肯定走这
      return [child]
    }
  }else{ // 最后一次肯定走这
    return parent
  }
}


LIFECYCLE_HOOKS.forEach(hook=>{
  starts[hook] = mergeHook
})

/*
  普通属性合并 如果都是对象直接合并（如果存在同一值，后面替换前面的） 
  子有该属性那么就用子的 否则直接用父
*/
export function mergeOptions(parent,child) {
  const options = {} // 将合并结果存储

  for (let key in parent) { // 循环父 将父中属性添加到options 将找到子相同属性覆盖父类
    mergeField(key)
  }
  for (let key in child) { // 循环子 将子中属性添加到options
    if (!parent.hasOwnProperty(key))mergeField(key) // 如果父类存在此属性那么不需添加到options
  }
  function mergeField(key) {
    // 策略模式 根据不同情况执行不同策略
    if (starts[key]) {
      return options[key] = starts[key](parent[key],child[key])
    }

    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = {...parent[key],...child[key]}
    }else{
      options[key] = child[key] ? child[key] : parent[key]
    }
  }
  console.log(options)
  return options
}
