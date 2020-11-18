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
    console.log(vm.$options)
    if (isObject(Ctor)) Ctor = vm.$options._base.extend(Ctor) // 对象即生成一个函数
    data.hook = {
        init(vnode){
            let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
        }
    }
}

export function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}


function vnode(vm, tag, data,key,children,text) {
    return {
        vm,
        tag,
        children,
        data,
        key,
        text
    }

}
