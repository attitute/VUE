import Watcher from "./observer/watcher"

// 渲染真实dom

// 调用自定义render方法
export function lifecycleMixin(Vue) {
  Vue.prototype._update = (vnode)=>{
  }
}


export function mountComponent(vm, el) {
  console.log(vm)
  // 默认vue是通过watcher来进行渲染的  vue每一个组件有一个渲染watcher


    let updateComponent = ()=>{
      vm._update(vm._render()); // 虚拟节点
    }

    // 最后一个参数表示 这是一个渲染wathcer
    new Watcher(vm, updateComponent, ()=>{}, true)
}
