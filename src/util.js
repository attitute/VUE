
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
