import { createElement, createTextVnode } from "./vdom/index"

// 调用自定义render方法
export function renderMixin (Vue) {
  Vue.prototype._c = function (...args) {
    const vm = this
    return createElement(vm, ...args)
  }
  Vue.prototype._v = function (text) {
    const vm = this
    return createTextVnode(vm, text)
  }
  Vue.prototype._s = function (value) { // 转字符串
    return value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : value 
  }
  Vue.prototype._render = function(){

    const vm = this

    let render = vm.$options.render
    let vnode = render.call(vm) // _c(xxx,xxx)调用时会自动将变量取值 将实例结果进行渲染

    return vnode // 生成虚拟节点
  }
}

