import { mergeOptions } from "../util"

export function initGlobalAPI(Vue) {
    Vue.options = {}
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }

    Vue.options._base = Vue // 存储Vue构造函数
    Vue.options.components = {} // 用来存放组件的定义
    Vue.component = function (id,definition) {
        definition.name = definition.name || id // 规则是先取用组件定义的名字
        definition = this.options._base.extend(definition) // Vue构造函数的方法
        this.options.components[id] = definition
    }
    let cid = 0
    // 组件渲染走之前Vue init 那一套
    Vue.extend = function (options) { // 子组件初始化使用
        const Super = this // Vue构造函数
        const Sub = function VueComponent(options) {
            this._init(options) // 子组件初始化 
        }
        Sub.cid = cid++
        Sub.prototype = Object.create(Super.prototype) // 子类继承父类
        Sub.prototype.constructor = Sub // 子类继承父类
        Sub.component = Super.component // 把Vue构造函数的静态方法component给子实例
        // ... 还有很多方法

        // 子类也需要options 把父类的options 和子类的options合并
        Sub.options = mergeOptions(Super.options,options) 
        return Sub // 这个构造函数是由对象产生的
    
    }



}