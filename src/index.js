
import { initGlobalAPI } from './global-api/index'
import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'

// Vue的核心代码 只是Vue的一个声明
function Vue(options) {
  // 进行vue初始化的操作
  this._init(options)
}

// 通过引入文件的方式 给Vue原型上添加方法
initMixin(Vue) // 扩展初始化方法
lifecycleMixin(Vue) // 扩展_update方法
renderMixin(Vue) // 扩展_render方法

initGlobalAPI(Vue) // 混合全局的api



export default Vue
