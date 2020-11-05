
import {initState} from './state'
import {compileToFunctions} from './compiler/index'
import { mountComponent } from './lifecycle'

// 在原型上添加一个init 方法
export function initMixin (Vue) {
  // 初始化流程
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this // vue中使用 this.$options 指代的就是用户传递的属性
    vm.$options = options

    // 初始化状态
    initState(vm) // 分割代码
    
    if (vm.$options.el) { // 数据可以挂载到页面上
      vm.$mount(vm.$options.el)
    }
  }
  // 获取template
  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    const options = vm.$options

    if(!options.render){ // 没有render函数时
      let template = options.template
      if(!template && el) { // 没有template并且 el元素存在 获取页面html
        template = el.outerHTML
      }
      // 把模板编译成render函数
      const render = compileToFunctions(template)
      options.render = render
      console.log(options.render)
    }

    mountComponent(vm, el) // 组件挂载
  }
}