import {isObject, isReservedTag} from '../util'

export function createElement(vm, tag, data={}, ...children) {
    // 需要对标签名做过滤 因为有可能是自定义组件
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined)
    }else {
        // 自定义组件
        const Ctor = vm.$options.components[tag] // 可能是组件或者对象
        return createComponent(vm,tag,data,data.key,children,Ctor)
    }
}
function createComponent(vm,tag,data,key,children,Ctor) {
    if (isObject(Ctor)) Ctor = vm.$options._base.extend(Ctor) // 是对象即生成一个函数
    // 给组件增加生命周期 组件才有hook
    data.hook = {
        init(vnode){
            // 调用子组件得构造函数
            let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
            child.$mount() // 组件直接调用继承过来的方法 组件上有$el属性vnode.componentInstance.$el
        }
    }
    return vnode(vm,`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,undefined,{Ctor})
}

export function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}


function vnode(vm, tag, data,key,children,text,componentOptions) {
    return {
        vm,
        tag,
        children,
        data,
        key,
        text,
        componentOptions
    }

}

export function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key)
}
