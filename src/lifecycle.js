import Watcher from "./observer/watcher"
import {patch} from './vdom/patch'

// 将虚拟节点渲染真实dom

// 调用自定义render方法
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode){

    const vm = this
    // 首次渲染 需要用虚拟节点 来更新真实得dom元素
    vm.$options.el= patch(vm.$options.el, vnode)
  }
}


export function mountComponent(vm, el) {
  // 默认vue是通过watcher来进行渲染的  vue每一个组件有一个渲染watcher


    let updateComponent = ()=>{
      vm._update(vm._render()); // 虚拟节点
    }

    // 最后一个参数表示 这是一个渲染wathcer
    new Watcher(vm, updateComponent, ()=>{}, true)
}
