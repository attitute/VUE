import { createElement } from "."

export function patch (oldVnode,vnode) {
    // oldVnode 是一个真实的元素
    const isRealElment = oldVnode.nodeType

    if(isRealElment){
        // 初次渲染
        const oldElm = oldVnode // id = "app"
        const parentElm = oldElm.parentNode // body

        let el = createElm(vnode) // 根据虚拟节点创建真实的节点

        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)
        console.log(el)

        return el // vm.$el

    }else {
        // diff算法

    }

}

function createElm(vnode) {
    let {tag, children, key, data, text, vm} = vnode

    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag) // 生成元素

        updateProperties(vnode) // 生成样式

        children.forEach(child=>{ // 递归 产生元素
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }

    return vnode.el

}

function updateProperties(vnode) {
    let newProps = vnode.data || {} // 属性
    let el = vnode.el // dom 元素

    for(let key in newProps) {
        if (key == 'style') { // key是不是style
            console.log(newProps)
            el.style = newProps.style
        } else if (key == 'class'){
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}