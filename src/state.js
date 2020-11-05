import {observe} from './observer/index.js'

export function initState(vm) {
  const opts = vm.$options // 获取用户属性
  // vue的数据来源 属性 方法 数据 计算属性 watch  数据初始化
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get(){
      return vm[source][key]
    },
    set(nv){
      vm[source][key] = nv
    }
  })
}

function initData(vm) {
  let data = vm.$options.data // 用户传递的data
  // 对data类型进行判断 如果是函数 获取函数返回值作为对象 
  // .call的原因 为了让data函数中的this指向vm methods等中的this同理
  data = vm._data = typeof data === 'function'? data.call(vm) : data

  // 通过vm._data 获取劫持后的数据， 用户就可以拿到_data了
  // 将_data中的数据全部放到vm上
  for(let key in data){
    proxy(vm, '_data', key)
  }

  // 观测数据
  observe(data)
}