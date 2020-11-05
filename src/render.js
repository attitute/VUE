import { createElement, createTextVnode } from "./vdom/index"

// 调用自定义render方法
export function renderMixin (Vue) {
  console.log(this)
  Vue.prototype._c = function (...args) {
    return createElement(...args)
  }
  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  }
  Vue.prototype._s = function (value) { // 转字符串
    return value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : value 
  }
  Vue.prototype._render = function(){

    const vm = this

    let render = vm.$options.render

    let vnode = render.call(vm)

    return vnode
  }
}

